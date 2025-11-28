import connection from './connection'

const db = connection

export async function getAllComments() {
  const comments = await db('comments')
  return comments
}

export async function getCommentsByPostId(postId: number) {
  const matchingComments = await db('comments').where('post_id', postId)
  return matchingComments
}

export async function getCommentsByUserId(userId: number) {
  const matchingComments = await db('comments').where('user_id', userId)
  return matchingComments
}
