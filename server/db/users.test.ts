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
    const authId = 'google-oauth2|116118796709799810524' // Matt v2's authId from seed
    const user = await db.getUserProfile(authId, testDb)

    expect(user).toBeDefined()
    expect(user.name).toBe('Matt v2')
  })

  it('should return undefined for a non-existent authId', async () => {
    const authId = 'non-existent-id'
    const user = await db.getUserProfile(authId, testDb)

    expect(user).toBeUndefined()
  })
})

describe('getUserPosts', () => {
  it('should return all posts for a user with a given authId', async () => {
    // User 'Sofia' (auth_id: '1') has 1 post in the seed data
    const authId = '1'
    const posts = await db.getUserPosts(authId, testDb)

    expect(posts).toHaveLength(1)
    expect(posts[0].userName).toBe('Sofia')
  })

  it('should return an empty array if a user has no posts', async () => {
    // User 'Matt v2' has no posts in the seed data
    const authId = 'google-oauth2|116118796709799810524'
    const posts = await db.getUserPosts(authId, testDb)

    expect(posts).toHaveLength(0)
  })
})

describe('getFollowers', () => {
  it('should return followers for a given authId', async () => {
    // Sofia (auth_id: '1') is followed by Nikola (id:2), Patrick (id:3), and Matt v2 (id:7)
    const authId = '1'
    const followers = await db.getFollowers(authId, testDb)

    expect(followers).toBeDefined()
    expect(followers).toHaveLength(3)
    expect(followers.map((f) => f.name)).toEqual(
      expect.arrayContaining(['Nikola', 'Patrick', 'Matt v2']),
    )
  })

  it('should return an empty array if no followers are found', async () => {
    // User 4 (Matt) has no followers in the seed data
    const authId = '4'
    const followers = await db.getFollowers(authId, testDb)

    expect(followers).toBeDefined()
    expect(followers).toHaveLength(0)
  })
})

describe('getFollowing', () => {
  it('should return users a given authId is following', async () => {
    // Nikola (auth_id: '2') follows Sofia (id:1) and Patrick (id:3)
    const authId = '2'
    const following = await db.getFollowing(authId, testDb)

    expect(following).toBeDefined()
    expect(following).toHaveLength(2)
    expect(following.map((f) => f.name)).toEqual(
      expect.arrayContaining(['Sofia', 'Patrick']),
    )
  })

  it('should return an empty array if no users are being followed', async () => {
    // User 4 (Matt) is not following anyone in the seed data
    const authId = '4'
    const following = await db.getFollowing(authId, testDb)

    expect(following).toBeDefined()
    expect(following).toHaveLength(0)
  })
})
