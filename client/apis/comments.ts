import request from 'superagent'
import { Comment, CommentData } from '../../models/comment'

const rootUrl = '/api/v1/comments'

export async function getCommentsByPostId(id: number) {
  const response = await request.get(`${rootUrl}/posts/${id}`)
  return response.body
}

export async function getCommentsByUserId(id: number) {
  const response = await request.get(`${rootUrl}/users/${id}`)
  return response.body
}

export async function addComment(commentData: CommentData) {
  // console.log(commentData)
  const response = await request.post(`${rootUrl}`).send(commentData)
  return response.body
}

export async function editComment(id: number, comment: Comment) {
  const response = await request.patch(`${rootUrl}/${id}`).send(comment)
  return response.body
}

export async function deleteComment(id: number) {
  return await request.delete(`${rootUrl}/${id}`)
}
