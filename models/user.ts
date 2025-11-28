export interface User {
  id: number
  auth_id: string
  name: string
  bio: string
  font: string
  profile_picture: string
}

export interface UserData {
  authId: string
  name: string
  bio?: string
  font?: string
  profilePicture?: string
}
