import connection from './connection'
import { Post } from '../../models/post'

export async function getAllPosts(db = connection): Promise<Post[]> {
  const posts = await db('posts')
    .join('users', 'posts.user_id', 'users.id')
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
