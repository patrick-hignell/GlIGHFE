import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import request from 'supertest'
import { Response, NextFunction } from 'express'
import { User } from '../../models/user'
import { Post } from '../../models/post'

// Mock checkJwt middleware - must be placed before server import
vi.mock('../auth0.ts')
import checkJwt, { JwtRequest } from '../auth0'

// Mock database functions
vi.mock('../db/users', () => ({
  getUserProfile: vi.fn(),
  getUserPosts: vi.fn(),
  getFollowers: vi.fn(),
  getFollowing: vi.fn(),
  addFollow: vi.fn(),
  removeFollow: vi.fn(),
}))

import server from '../server'
import * as db from '../db/users'

afterEach(() => {
  vi.clearAllMocks()
})

describe('Existing User Routes', () => {
  const testAuthId = 'google-oauth2|116118796709799810524'

  const endpoints = [
    {
      name: 'User Profile',
      path: `/api/v1/users/${testAuthId}`,
      dbFunction: 'getUserProfile' as const,
    },
    {
      name: 'User Posts',
      path: `/api/v1/users/${testAuthId}/posts`,
      dbFunction: 'getUserPosts' as const,
    },
    {
      name: 'User Followers',
      path: `/api/v1/users/${testAuthId}/followers`,
      dbFunction: 'getFollowers' as const,
    },
    {
      name: 'User Following',
      path: `/api/v1/users/${testAuthId}/following`,
      dbFunction: 'getFollowing' as const,
    },
  ]

  const mockEndpointData = {
    getUserProfile: {
      id: 7,
      auth_id: testAuthId,
      name: 'Matt v2',
      bio: 'A bio',
      font: '',
      profile_picture: '',
    } as User,
    getUserPosts: [
      {
        id: 1,
        userId: testAuthId,
        userName: 'Matt v2',
        imageUrl: 'post_image.jpg',
        message: 'A post',
        dateAdded: '1678886400',
      },
    ] as Post[],
    getFollowers: [
      {
        id: 2,
        auth_id: 'auth0|nikola',
        name: 'Nikola',
        bio: '',
        font: '',
        profile_picture: '',
      },
    ] as User[],
    getFollowing: [
      {
        id: 1,
        auth_id: 'auth0|sofia',
        name: 'Sofia',
        bio: '',
        font: '',
        profile_picture: '',
      },
    ] as User[],
  }

  describe.each(endpoints)('$name endpoint', (endpoint) => {
    it('should return the correct data on success', async () => {
      const data = mockEndpointData[endpoint.dbFunction]
      vi.mocked(db[endpoint.dbFunction]).mockResolvedValue(data as never)
      const res = await request(server).get(endpoint.path)

      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(data)
      expect(vi.mocked(db[endpoint.dbFunction])).toHaveBeenCalledWith(
        testAuthId,
      )
    })

    it('should return 200 with empty array if no data is found for list endpoints', async () => {
      if (
        endpoint.dbFunction === 'getUserPosts' ||
        endpoint.dbFunction === 'getFollowers' ||
        endpoint.dbFunction === 'getFollowing'
      ) {
        vi.mocked(db[endpoint.dbFunction]).mockResolvedValue([])
        const res = await request(server).get(endpoint.path)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([])
      } else if (endpoint.dbFunction === 'getUserProfile') {
        vi.mocked(db[endpoint.dbFunction]).mockResolvedValue(
          undefined as unknown as User,
        )
        const res = await request(server).get(endpoint.path)
        expect(res.statusCode).toBe(404)
        expect(res.text).toBe('User not found')
      }
    })

    it('should return 500 if the database call fails', async () => {
      vi.mocked(db[endpoint.dbFunction]).mockRejectedValue(
        new Error('Database error'),
      )
      const res = await request(server).get(endpoint.path)

      expect(res.statusCode).toBe(500)
      expect(res.text).toContain('Database error')
    })
  })
})

describe('POST /api/v1/users/:id/follow', () => {
  const followerId = 'auth0-follower-user'
  const followingId = 'auth0-following-user'

  beforeEach(() => {
    // Set authenticated user for follow tests
    vi.mocked(checkJwt).mockImplementation(
      (req: JwtRequest, res: Response, next: NextFunction) => {
        req.auth = { sub: followerId }
        next()
        return Promise.resolve()
      },
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return 201 on successful follow', async () => {
    // Mock successful insert - returns array with inserted ID
    vi.mocked(db.addFollow).mockResolvedValue([1])

    const res = await request(server).post(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(201)
    expect(db.addFollow).toHaveBeenCalledWith(followerId, followingId)
  })

  it('should return 400 when a user tries to follow themselves', async () => {
    vi.mocked(checkJwt).mockImplementationOnce(
      (req: JwtRequest, res: Response, next: NextFunction) => {
        req.auth = { sub: followingId }
        next()
        return Promise.resolve()
      },
    )
    const res = await request(server).post(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(400)
    expect(res.text).toBe('Cannot follow yourself')
    expect(db.addFollow).not.toHaveBeenCalled()
  })

  it('should return 401 if unauthenticated', async () => {
    vi.mocked(checkJwt).mockImplementationOnce(
      (req: JwtRequest, res: Response, next: NextFunction) => {
        req.auth = undefined
        next()
        return Promise.resolve()
      },
    )

    const res = await request(server).post(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(401)
    expect(db.addFollow).not.toHaveBeenCalled()
  })

  it('should return 409 if the follow relationship already exists', async () => {
    // Mock returns empty array to indicate duplicate follow attempt
    vi.mocked(db.addFollow).mockResolvedValue([])

    const res = await request(server).post(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(409)
    expect(res.text).toBe('Already following this user')
    expect(db.addFollow).toHaveBeenCalledWith(followerId, followingId)
  })

  it('should return 500 on database error', async () => {
    vi.mocked(db.addFollow).mockRejectedValue(new Error('DB error'))

    const res = await request(server).post(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(500)
    expect(res.text).toContain('DB error')
  })
})

describe('DELETE /api/v1/users/:id/follow', () => {
  const followerId = 'auth0-follower-user'
  const followingId = 'auth0-following-user'

  beforeEach(() => {
    // Set authenticated user for unfollow tests
    vi.mocked(checkJwt).mockImplementation(
      (req: JwtRequest, res: Response, next: NextFunction) => {
        req.auth = { sub: followerId }
        next()
        return Promise.resolve()
      },
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return 200 on successful unfollow', async () => {
    vi.mocked(db.removeFollow).mockResolvedValue(1)

    const res = await request(server).delete(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(200)
    expect(db.removeFollow).toHaveBeenCalledWith(followerId, followingId)
  })

  it('should return 404 if the follow relationship does not exist', async () => {
    // Zero rows deleted indicates relationship doesn't exist
    vi.mocked(db.removeFollow).mockResolvedValue(0)

    const res = await request(server).delete(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(404)
    expect(res.text).toBe('Follow relationship not found')
  })

  it('should return 401 if unauthenticated', async () => {
    vi.mocked(checkJwt).mockImplementationOnce(
      (req: JwtRequest, res: Response, next: NextFunction) => {
        req.auth = undefined
        next()
        return Promise.resolve()
      },
    )

    const res = await request(server).delete(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(401)
    expect(db.removeFollow).not.toHaveBeenCalled()
  })

  it('should return 500 on database error', async () => {
    vi.mocked(db.removeFollow).mockRejectedValue(new Error('DB error'))

    const res = await request(server).delete(
      `/api/v1/users/${followingId}/follow`,
    )

    expect(res.statusCode).toBe(500)
    expect(res.text).toContain('DB error')
  })
})
