export interface Post {
  id: number
  userId: string
  userName: string
  imageUrl: string
  message: string
  dateAdded: string
}

export interface PostData {
  userId: string
  imageUrl: string
  message: string
  font: string
  charLimit: number
  public: boolean
}
