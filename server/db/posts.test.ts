import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import knex from 'knex'
import config from './knexfile'
import { getAllPosts } from './posts'

// Create a test database connection
const testDb = knex(config.test)

beforeAll(async () => {
  // Run migrations
  await testDb.migrate.latest()
})

beforeEach(async () => {
  // Seed the database with mock data
  await testDb.seed.run()
})

afterAll(async () => {
  // Close the database connection
  await testDb.destroy()
})

describe('getAllPosts', () => {
  it('should return all posts with their user information', async () => {
    // Act: Call the function
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

    // A more specific check on the first post's content
    expect(posts[0].userName).toBe('Sofia')
    expect(posts[0].message).toBe('') // Based on seed file
    expect(posts[0].imageUrl).toBe('kitten')
  })
})
