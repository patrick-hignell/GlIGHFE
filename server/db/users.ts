import db from './connection.js'
import { User, UserData } from '../../models/user.js'

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
