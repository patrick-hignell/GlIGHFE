import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as API from '../apis/posts.ts'
import {
  fetchAllPosts,
  fetchAllPostsWithAuthor,
  fetchPostByIdWithAuthor,
} from '../apis/posts'
import { PostData } from '../../models/post.ts'
import { PostWithAuthor } from '../../models/post.ts'

export function usePosts() {
  const query = useQuery({ queryKey: ['posts'], queryFn: fetchAllPosts })
  return {
    ...query,
    add: useAddPost,
    // add more post queries/mutations here if needed later
  }
}

export function usePostsWithAuthor() {
  const query = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPostsWithAuthor,
  })
  return {
    ...query,
    add: useAddPost,
  }
}

export function useGetPostById(postId: PostWithAuthor['id']) {
  const query = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostByIdWithAuthor(postId),
  })
  return {
    ...query,
  }
}

export function useAddPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: PostData) => API.addPost(post),
    onSuccess: (_, variables) => {
      // Refresh the main feed to show the new post
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      // Refresh the user's profile page to show their new post
      queryClient.invalidateQueries({
        queryKey: ['profilePosts', variables.userId],
      })
    },
  })
}
