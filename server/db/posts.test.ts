import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import knex from 'knex'
import config from './knexfile'
import { getAllPosts, getAllPostsWithAuthor } from './posts'

const testDb = knex(config.test)

beforeAll(async () => {
  await testDb.migrate.latest()
})

beforeEach(async () => {
  // Clear tables in correct order (respecting foreign keys)
  await testDb('comments').del()
  await testDb('posts').del()
  await testDb('users').del()

  // Seed only the data needed for these tests
  await testDb('users').insert([
    {
      id: 1,
      auth_id: '1',
      name: 'Sofia',
      bio: '',
      font: '',
      profile_picture: 'kitten',
    },
    {
      id: 2,
      auth_id: '2',
      name: 'Nikola',
      bio: '',
      font: '',
      profile_picture: '',
    },
    {
      id: 3,
      auth_id: '3',
      name: 'Patrick',
      bio: '',
      font: '',
      profile_picture: '',
    },
    {
      id: 4,
      auth_id: '4',
      name: 'Matt',
      bio: '',
      font: '',
      profile_picture: '',
    },
  ])

  // Seed posts with different timestamps for ordering tests
  await testDb('posts').insert([
    {
      id: 1,
      user_id: '1',
      image: 'kitten',
      message: '',
      date_added: '1678886400', // Oldest
    },
    {
      id: 2,
      user_id: '2',
      image: '',
      message: 'Post 2',
      date_added: '1678886401',
    },
    {
      id: 3,
      user_id: '3',
      image: '',
      message: 'Post 3',
      date_added: '1678886402',
    },
    {
      id: 4,
      user_id: '4',
      image: '',
      message: 'Post 4',
      date_added: '1678886403', // Most recent
    },
  ])
})

afterAll(async () => {
  await testDb.destroy()
})

describe('getAllPosts', () => {
  it('should return all posts with their user information', async () => {
    const posts = await getAllPosts(testDb)

    // Assert: Check the number of posts
    expect(posts).toHaveLength(4)

    // Assert: Check the structure and content of the first post
    expect(posts[0]).toHaveProperty('id')
    expect(posts[0]).toHaveProperty('userId')
    expect(posts[0]).toHaveProperty('userName')
    expect(posts[0]).toHaveProperty('imageUrl')
    expect(posts[0]).toHaveProperty('message')
    expect(posts[0]).toHaveProperty('dateAdded')

    // Posts are ordered by date DESC, so most recent (id: 4) is first
    expect(posts[0].id).toBe(4)
    expect(posts[0].userName).toBe('Matt')

    // Check that Sofia's post (oldest) is last
    expect(posts[3].id).toBe(1)
    expect(posts[3].userName).toBe('Sofia')
    expect(posts[3].message).toBe('') // Based on our seed
    expect(posts[3].imageUrl).toBe('kitten') // Based on our seed
  })
})

describe('getAllPostsWithAuthor with pagination', () => {
  it('should return correct number of posts based on limit', async () => {
    // Assuming seed has 4 posts
    const posts = await getAllPostsWithAuthor(2, 0, testDb) // limit=2, offset=0

    expect(posts).toHaveLength(2)
  })

  it('should return correct posts based on offset', async () => {
    const firstPage = await getAllPostsWithAuthor(2, 0, testDb)
    const secondPage = await getAllPostsWithAuthor(2, 2, testDb)

    // Should be different posts
    expect(firstPage[0].id).not.toBe(secondPage[0].id)

    // First page should have most recent posts (id: 4, 3)
    expect(firstPage[0].id).toBe(4)
    expect(firstPage[1].id).toBe(3)

    // Second page should have older posts (id: 2, 1)
    expect(secondPage[0].id).toBe(2)
    expect(secondPage[1].id).toBe(1)
  })

  it('should return empty array when offset exceeds total posts', async () => {
    const posts = await getAllPostsWithAuthor(10, 100, testDb)

    expect(posts).toHaveLength(0)
  })

  it('should order posts by date descending', async () => {
    const posts = await getAllPostsWithAuthor(10, 0, testDb)

    // Most recent post should be first
    expect(posts[0].id).toBe(4) // Post with date_added: 1678886403
    expect(posts[0].userName).toBe('Matt')

    // Oldest post should be last
    expect(posts[3].id).toBe(1) // Post with date_added: 1678886400
    expect(posts[3].userName).toBe('Sofia')

    // Verify all posts are in descending order
    for (let i = 0; i < posts.length - 1; i++) {
      const current = parseInt(posts[i].dateAdded)
      const next = parseInt(posts[i + 1].dateAdded)
      expect(current).toBeGreaterThanOrEqual(next)
    }
  })
})
