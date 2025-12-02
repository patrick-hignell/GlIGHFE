import request from 'superagent'
import { User, UserData, UserWithSelection } from '../../models/user'
import { PostWithAuthor } from '../../models/post'

// const rootURL = new URL(`/api/v1`, document.baseURI)  ||| updated to new code in ‹feature/profile-page› branch
const rootURL = `/api/v1`

export async function getUserById(authId: string): Promise<User> {
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

export async function editUserProfile(user: UserWithSelection): Promise<User> {
  const response = await request
    .patch(`${rootURL}/users/profile`)
    .send({ user })
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

export async function fetchUserPosts(
  authId: string,
): Promise<PostWithAuthor[]> {
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
