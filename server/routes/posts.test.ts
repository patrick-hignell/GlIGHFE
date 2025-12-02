import { describe, it, expect, vi, afterEach } from 'vitest'
import request from 'supertest'
import server from '../server' // Import your Express server

// Mock the database functions
// This ensures our API test doesn't actually hit the database
vi.mock('../db/posts', () => ({
  getAllPosts: vi.fn(),
  getAllPostsWithAuthor: vi.fn(),
}))

import * as db from '../db/posts' // Import the mocked module

afterEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/v1/posts', () => {
  it('should return a list of posts', async () => {
    // Arrange: Define mock posts that our mocked getAllPosts will return
    const mockPosts = [
      {
        id: 1,
        userId: 1,
        userName: 'Sofia',
        imageUrl: 'http://example.com/image1.jpg',
        message: 'Hello world!',
        dateAdded: 1678886400,
      },
      {
        id: 2,
        userId: 2,
        userName: 'Nikola',
        imageUrl: 'http://example.com/image2.jpg',
        message: 'Vitest is awesome.',
        dateAdded: 1678886500,
      },
    ]

    // Tell the mocked getAllPosts function to return our mock data
    vi.mocked(db.getAllPosts).mockResolvedValue(mockPosts)

    // Act: Make a request to the API endpoint
    const res = await request(server).get('/api/v1/posts')

    // Assert: Check the response
    expect(res.statusCode).toBe(200)
    expect(res.body.posts).toEqual(mockPosts)
    expect(db.getAllPosts).toHaveBeenCalledOnce() // Ensure the db function was called
  })

  it('should return an empty array if no posts are found', async () => {
    // Arrange: Tell the mocked getAllPosts function to return an empty array
    vi.mocked(db.getAllPosts).mockResolvedValue([])

    // Act: Make a request to the API endpoint
    const res = await request(server).get('/api/v1/posts')

    // Assert: Check the response
    expect(res.statusCode).toBe(200)
    expect(res.body.posts).toEqual([])
    expect(db.getAllPosts).toHaveBeenCalledOnce()
  })

  it('should return 500 if the database call fails', async () => {
    // Arrange: Tell the mocked getAllPosts function to throw an error
    vi.mocked(db.getAllPosts).mockRejectedValue(new Error('Database error'))

    // Act: Make a request to the API endpoint
    const res = await request(server).get('/api/v1/posts')

    // Assert: Check the response
    expect(res.statusCode).toBe(500)
    expect(res.body.message).toBe('Something went wrong')
    expect(db.getAllPosts).toHaveBeenCalledOnce()
  })
})

describe('GET /api/v1/posts/withAuthor with pagination', () => {
  it('should pass limit and offset to database function', async () => {
    const mockPosts = [
      {
        id: 1,
        userId: '1',
        userName: 'User1',
        message: 'Post 1',
        imageUrl: '',
        dateAdded: '',
        profilePicture: '',
      },
      {
        id: 2,
        userId: '2',
        userName: 'User2',
        message: 'Post 2',
        imageUrl: '',
        dateAdded: '',
        profilePicture: '',
      },
    ]

    vi.mocked(db.getAllPostsWithAuthor).mockResolvedValue(mockPosts)

    const res = await request(server).get(
      '/api/v1/posts/withAuthor?limit=10&offset=20',
    )

    expect(res.statusCode).toBe(200)
    expect(res.body.posts).toEqual(mockPosts)
    // CRITICAL: Verify function called with correct pagination params
    expect(db.getAllPostsWithAuthor).toHaveBeenCalledWith(10, 20)
  })

  it('should use default pagination values when not provided', async () => {
    vi.mocked(db.getAllPostsWithAuthor).mockResolvedValue([])

    const res = await request(server).get('/api/v1/posts/withAuthor')

    expect(res.statusCode).toBe(200)
    // Should default to limit=10, offset=0
    expect(db.getAllPostsWithAuthor).toHaveBeenCalledWith(10, 0)
  })

  it('should handle invalid pagination parameters gracefully', async () => {
    vi.mocked(db.getAllPostsWithAuthor).mockResolvedValue([])

    const res = await request(server).get(
      '/api/v1/posts/withAuthor?limit=abc&offset=xyz',
    )

    expect(res.statusCode).toBe(200)
    // Should default to NaN -> 10, 0
    expect(db.getAllPostsWithAuthor).toHaveBeenCalledWith(10, 0)
  })
})
