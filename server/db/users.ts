import db from './connection.js'
import { User, UserData } from '../../models/user.js'
import { Post } from '../../models/post.js'
import { Knex } from 'knex'

// export async function getAllFruits() {
//   const fruit = await db('fruit').select()
//   return fruit as Fruit[]
// }

export async function getUserById(auth_id: string): Promise<User> {
  const result = await db('users').select().first().where('auth_id', auth_id)
  return result
}

export async function addUser({
  authId,
  name,
  bio,
  font,
  profilePicture,
}: UserData) {
  const result = await db('users').insert({
    auth_id: authId,
    name,
    bio,
    font,
    profile_picture: profilePicture,
  })
  return result
}

// Note - Following code has been refactored to use authId instead of numeric ID:

// Get basic User info for profiles
export async function getUserProfile(
  authId: string,
  testDb?: Knex,
): Promise<User> {
  const connection = testDb || db // Use testDb if provided, otherwise use default db
  const user = await connection('users')
    .select('id', 'name', 'bio', 'profile_picture')
    .where('auth_id', authId)
    .first()
  return user
}

// Retrieve all posts from User
export async function getUserPosts(
  authId: string,
  testDb?: Knex,
): Promise<Post[]> {
  const connection = testDb || db
  const postsFromDb = await connection('posts')
    .join('users', 'posts.user_id', 'users.auth_id')
    .select(
      'posts.id',
      'posts.user_id as userId',
      'users.name as userName',
      'posts.message',
      'posts.image as imageUrl',
      'posts.date_added as dateAdded', // A* Fetch the date as a string
    )
    .where('users.auth_id', authId)
    .orderBy('posts.date_added', 'desc')

  return postsFromDb as Post[] // Removed the map and added type assertion
}

// Get followers of User
export async function getFollowers(
  authId: string,
  testDb?: Knex,
): Promise<User[]> {
  const connection = testDb || db // Use testDb if provided, otherwise use default db
  const userIdQuery = connection('users').select('id').where('auth_id', authId)

  const followers = await connection('followers')
    .join('users', 'followers.follower_id', 'users.id')
    .where('followers.following_id', userIdQuery)
    .select('users.id', 'users.name', 'users.profile_picture')
  return followers
}

// Get who User is following
export async function getFollowing(
  authId: string,
  testDb?: Knex,
): Promise<User[]> {
  const connection = testDb || db // Use testDb if provided, otherwise use default db
  const userIdQuery = connection('users').select('id').where('auth_id', authId)

  const following = await connection('followers')
    .join('users', 'followers.following_id', 'users.id')
    .where('followers.follower_id', userIdQuery)
    .select('users.id', 'users.name', 'users.profile_picture')
  return following
}
