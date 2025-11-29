import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import knex from 'knex'
import config from './knexfile'
import * as db from './users'

const testDb = knex(config.test)

// Run migrations once before all tests
beforeAll(async () => {
  await testDb.migrate.latest()
})

// Seed the database before each test
beforeEach(async () => {
  await testDb.seed.run()
})

// Close the database connection after all tests
afterAll(async () => {
  await testDb.destroy()
})

describe('getUserProfile', () => {
  it('should return a user profile for a given authId', async () => {
    const authId = 'google-oauth2|116118796709799810524'
    const user = await db.getUserProfile(authId, testDb)
    expect(user).toBeDefined()
    expect(user.name).toBe('Matt v2')
  })

  it('should return undefined for a non-existent authId', async () => {
    const user = await db.getUserProfile('non-existent-id', testDb)
    expect(user).toBeUndefined()
  })
})

describe('getUserPosts', () => {
  it('should return all posts for a user with a given authId', async () => {
    // User 'Sofia' (auth_id: '1') has 1 post in the seed data
    const authId = '1'
    const posts = await db.getUserPosts(authId, testDb)
    expect(posts).toHaveLength(1) // Corrected from 2 to 1
    expect(posts[0].userName).toBe('Sofia')
  })

  it('should return an empty array if a user has no posts', async () => {
    const authId = 'google-oauth2|116118796709799810524'
    const posts = await db.getUserPosts(authId, testDb)
    expect(posts).toHaveLength(0)
  })
})

describe('getFollowers', () => {
  it.todo('should return followers for a given authId')
})

describe('getFollowing', () => {
  it.todo('should return users a given authId is following')
})
