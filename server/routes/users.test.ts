import { describe, it, expect, vi, afterEach } from 'vitest'
import request from 'supertest'
import server from '../server'
import { User } from '../../models/user'
import { Post } from '../../models/post'

vi.mock('../db/users', () => ({
  getUserProfile: vi.fn(),
  getUserPosts: vi.fn(),
  getFollowers: vi.fn(),
  getFollowing: vi.fn(),
}))

import * as db from '../db/users'

afterEach(() => {
  vi.clearAllMocks()
})

const testAuthId = 'google-oauth2|116118796709799810524'

// Data structure for our data-driven tests
const endpoints = [
  {
    name: 'User Profile',
    path: `/api/v1/users/${testAuthId}`,
    dbFunction: 'getUserProfile' as keyof typeof db,
    mockData: {
      id: 7,
      auth_id: testAuthId,
      name: 'Matt v2',
      bio: 'A bio',
      font: '',
      profile_picture: '',
    } as User,
    notFoundValue: undefined,
    notFoundStatus: 404,
  },
  {
    name: 'User Posts',
    path: `/api/v1/users/${testAuthId}/posts`,
    dbFunction: 'getUserPosts' as keyof typeof db,
    mockData: [
      {
        id: 1,
        userId: testAuthId,
        userName: 'Matt v2',
        imageUrl: 'post_image.jpg',
        message: 'A post',
        dateAdded: '1678886400',
      },
    ] as Post[],
    notFoundValue: [], // Empty array for "not found"
    notFoundStatus: 200,
  },
  {
    name: 'User Followers',
    path: `/api/v1/users/${testAuthId}/followers`,
    dbFunction: 'getFollowers' as keyof typeof db,
    mockData: [
      {
        id: 2,
        auth_id: 'auth0|nikola',
        name: 'Nikola',
        bio: '',
        font: '',
        profile_picture: '',
      },
    ] as User[],
    notFoundValue: [],
    notFoundStatus: 200,
  },
  {
    name: 'User Following',
    path: `/api/v1/users/${testAuthId}/following`,
    dbFunction: 'getFollowing' as keyof typeof db,
    mockData: [
      {
        id: 1,
        auth_id: 'auth0|sofia',
        name: 'Sofia',
        bio: '',
        font: '',
        profile_picture: '',
      },
    ] as User[],
    notFoundValue: [],
    notFoundStatus: 200,
  },
]

describe.each(endpoints)('Tests for $name endpoint', (endpoint) => {
  const { path, dbFunction, mockData, notFoundValue, notFoundStatus } = endpoint

  it('should return the correct data on success', async () => {
    vi.mocked(db[dbFunction]).mockResolvedValue(mockData as never)
    const res = await request(server).get(path)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(mockData)
    expect(db[dbFunction]).toHaveBeenCalledWith(testAuthId)
  })

  it('should return the correct status when no data is found', async () => {
    vi.mocked(db[dbFunction]).mockResolvedValue(notFoundValue as never)
    const res = await request(server).get(path)

    expect(res.statusCode).toBe(notFoundStatus)
    if (notFoundValue !== undefined) {
      expect(res.body).toEqual(notFoundValue)
    }
  })

  it('should return 500 if the database call fails', async () => {
    vi.mocked(db[dbFunction]).mockRejectedValue(new Error('Database error'))
    const res = await request(server).get(path)

    expect(res.statusCode).toBe(500)
    expect(res.text).toContain('Database error')
  })
})
