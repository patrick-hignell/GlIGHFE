import request from 'superagent'
import { UserData } from '../../models/user'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUserById(authId: string): Promise<UserData> {
  const response = await request.get(`${rootURL}/users/${authId}`)
  return response.body
}

export async function createUser(userData: UserData): Promise<void> {
  await request.post(`${rootURL}/users`).send(userData)
}
