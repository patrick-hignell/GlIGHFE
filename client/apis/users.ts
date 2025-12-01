import request from 'superagent'
import { User, UserData } from '../../models/user'
import { Post } from '../../models/post'

// const rootURL = new URL(`/api/v1`, document.baseURI)  ||| updated to new code in ‹feature/profile-page› branch
const rootURL = `/api/v1`

// ARCHITECTURAL NOTE: All user-facing API calls in this project should use
// the string `authId` for identification, not the internal numeric database `id`.

export async function getUserById(authId: string): Promise<UserData> {
  const response = await request.get(`${rootURL}/users/${authId}`)
  return response.body
}

export async function createUser(userData: UserData): Promise<void> {
  await request.post(`${rootURL}/users`).send(userData)
}

export async function editUser(user: User): Promise<string> {
  const response = await request.put(`${rootURL}/users`).send(user)
  return response.body
}

export async function editUserProfilePicture(
  authId: string,
  profilePicture: string,
): Promise<void> {
  await request.patch(`${rootURL}/users`).send({ authId, profilePicture })
}

// --- Functions for Profile Page ---
export async function fetchUserProfile(authId: string): Promise<User> {
  const response = await request.get(`${rootURL}/users/${authId}`)
  return response.body
}

export async function fetchUserPosts(authId: string): Promise<Post[]> {
  const response = await request.get(`${rootURL}/users/${authId}/posts`)
  return response.body
}

export async function fetchFollowers(authId: string): Promise<User[]> {
  const response = await request.get(`${rootURL}/users/${authId}/followers`)
  return response.body
}

export async function fetchFollowing(authId: string): Promise<User[]> {
  const response = await request.get(`${rootURL}/users/${authId}/following`)
  return response.body
}
