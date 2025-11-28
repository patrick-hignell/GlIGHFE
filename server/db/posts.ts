import connection from './connection'
import { Post, PostData } from '../../models/post'

const db = connection
export async function getAllPosts(db = connection): Promise<Post[]> {
  const posts = await db('posts')
    .join('users', 'posts.user_id', 'users.auth_id')
    .select(
      'posts.id as id',
      'posts.user_id as userId',
      'users.name as userName',
      'posts.image as imageUrl',
      'posts.message',
      'posts.date_added as dateAdded',
    )
    .orderBy('posts.date_added', 'desc')
  return posts
}

export async function addPost(post: PostData): Promise<Post> {
  const result = await db('posts')
    .insert({
      user_id: post.userId,
      message: post.message,
      image: post.imageUrl,
      font: post.font,
      char_limit: post.charLimit,
      public: post.public,
    })
    .returning('*')
  return result[0]
}
