import request from 'superagent'
import { Comment, CommentData, CommentWithAuthor } from '../../models/comment'

const rootUrl = '/api/v1/comments'

export async function getCommentsByPostId(
  id: number,
): Promise<CommentWithAuthor[]> {
  const response = await request.get(`${rootUrl}/posts/${id}`)
  return response.body
}

export async function getCommentsByUserId(id: number): Promise<Comment[]> {
  const response = await request.get(`${rootUrl}/users/${id}`)
  return response.body
}

export async function addComment(commentData: CommentData) {
  // console.log(commentData)
  await request.post(`${rootUrl}`).send(commentData)
  // return response.body
}

export async function editComment(id: number, comment: Comment) {
  await request.patch(`${rootUrl}/${id}`).send(comment)
  // return response.body
}

export async function deleteComment(comment: Comment) {
  // console.log(comment)
  const response = await request.delete(`${rootUrl}`).send(comment)
  return response.body as Comment
}
