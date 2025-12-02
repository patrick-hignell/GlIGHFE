import { Post, PostData, PostWithAuthor } from '../../models/post'
import request from 'superagent'

const rootURL = new URL(`/api/v1/posts`, document.baseURI)

export async function fetchAllPosts(): Promise<Post[]> {
  const res = await fetch(rootURL)
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`)
  }
  const { posts } = await res.json()
  return posts
}

export async function fetchAllPostsWithAuthor(): Promise<PostWithAuthor[]> {
  const response = await request.get(`${rootURL}/withAuthor`)
  return response.body.posts as PostWithAuthor[]
}

export async function fetchPostByIdWithAuthor(
  id: PostWithAuthor['id'],
): Promise<PostWithAuthor> {
  const response = await request.get(`${rootURL}/${id}/withAuthor`)
  return response.body.post as PostWithAuthor
}

export async function addPost(post: PostData): Promise<Post> {
  const response = await request.post(`${rootURL}`).send(post)
  return response.body as Post
}
