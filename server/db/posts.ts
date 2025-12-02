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

export async function getAllPostsWithAuthor(db = connection): Promise<Post[]> {
  const posts = await db('posts')
    .join('users', 'posts.user_id', 'users.auth_id')
    .select(
      'posts.id as id',
      'posts.user_id as userId',
      'users.name as userName',
      'posts.image as imageUrl',
      'posts.message',
      'posts.date_added as dateAdded',
      'users.profile_picture as profilePicture',
    )
    .orderBy('posts.date_added', 'desc')
  return posts
}

export async function getPostbyIdWithAuthor(
  id: number,
): Promise<Post | undefined> {
  const post = await db('posts')
    .join('users', 'posts.user_id', 'users.auth_id')
    .select(
      'posts.id as id',
      'posts.user_id as userId',
      'users.name as userName',
      'posts.image as imageUrl',
      'posts.message',
      'posts.date_added as dateAdded',
      'users.profile_picture as profilePicture',
    )
    .where('posts.id', id)
    .first()
  return post
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

export async function deletePost(post: Post): Promise<Post> {
  await db('posts').where('id', post.id).delete().returning('*')
  // console.log(deletedEntry)
  return post
}
