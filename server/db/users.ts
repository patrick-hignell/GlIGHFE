import db from './connection.js'
import { User, UserData, UserWithSelection } from '../../models/user.js'
import { Post } from '../../models/post.js'
import { Knex } from 'knex'

// export async function getAllFruits() {
//   const fruit = await db('fruit').select()
//   return fruit as Fruit[]
// }

export async function getUserById(auth_id: string): Promise<User> {
  const result = await db('users')
    .where('auth_id', auth_id)
    .select(
      'id',
      'auth_id as authId',
      'name',
      'bio',
      'font',
      'profile_picture as profilePicture',
    )
    .first()
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

export async function editUser(user: User) {
  const result = await db('users')
    .where('auth_id', user.auth_id)
    .update({
      name: user.name,
      bio: user.bio,
      profile_picture: user.profile_picture,
      font: user.font,
    })
    .returning('*')
  return result[0]
}

export async function editUserProfile(user: UserWithSelection) {
  const result = await db('users')
    .where('auth_id', user.authId)
    .update({
      profile_picture: user.profilePicture,
      name: user.name,
      bio: user.bio,
    })
    .returning('*')
  return result[0]
}

export async function editUserProfilePicture(
  authId: string,
  profilePicture: string,
) {
  const result = await db('users')
    .where('auth_id', authId)
    .update({
      profile_picture: profilePicture,
    })
    .returning('*')
  return result[0]
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
      'users.profile_picture as profilePicture',
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
  const connection = testDb || db
  const followers = await connection('followers')
    .join('users', 'followers.follower_id', 'users.auth_id')
    .where('followers.following_id', authId)
    .select('users.auth_id', 'users.id', 'users.name', 'users.profile_picture')
  return followers
}

// Get who User is following
export async function getFollowing(
  authId: string,
  testDb?: Knex,
): Promise<User[]> {
  const connection = testDb || db
  const following = await connection('followers')
    .join('users', 'followers.following_id', 'users.auth_id')
    .where('followers.follower_id', authId)
    .select('users.auth_id', 'users.id', 'users.name', 'users.profile_picture')
  return following
}
