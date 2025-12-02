import connection from './connection'
import { Comment, CommentData } from '../../models/comment'

const db = connection

// GET

export async function getAllComments() {
  const comments = await db('comments')
  return comments
}

export async function getCommentsByPostId(postId: number) {
  const matchingComments = await db('comments')
    .join('users', 'comments.user_id', 'users.auth_id')
    .where('comments.post_id', postId)
    .select(
      'comments.id as id',
      'comments.post_id as postId',
      'comments.user_id as userId',
      'comments.message as message',
      'comments.image as image',
      'comments.font as font',
      'users.name as userName',
      'users.profile_picture as profilePicture',
    )

  return matchingComments
}

export async function getCommentsByUserId(userId: string) {
  const matchingComments = await db('comments').where('user_id', userId)
  return matchingComments
}

//ADD
export async function addComment(commentData: CommentData) {
  const { postId, userId, image, message, font } = commentData
  const [result] = await db('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      image,
      message,
      font,
    })
    .returning('id')
  return result
}

// UPDATE

export async function updateComment(commentId: number, commentData: Comment) {
  const { postId, userId, image, message, font } = commentData

  return await db('comments').where('id', commentId).update({
    post_id: postId,
    user_id: userId,
    image,
    message,
    font,
  })
}

//DELETE

export async function deleteComment(comment: Comment): Promise<Comment> {
  await db('comments').where('id', comment.id).delete().returning('*')
  return comment
}
