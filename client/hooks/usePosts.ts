import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import * as API from '../apis/posts.ts'
import { Post, PostData, PostWithAuthor } from '../../models/post.ts'
import {
  fetchAllPosts,
  fetchPostByIdWithAuthor,
  fetchPostsWithAuthorPaginated,
} from '../apis/posts'

const POSTS_PER_PAGE = 10

export function usePosts() {
  const query = useQuery({ queryKey: ['posts'], queryFn: fetchAllPosts })
  return {
    ...query,
    add: useAddPost,
    // add more post queries/mutations here if needed later
  }
}

export function usePostsWithAuthor() {
  return useInfiniteQuery({
    queryKey: ['postsWithAuthor'],
    queryFn: async ({ pageParam = 0 }) => {
      return fetchPostsWithAuthorPaginated(pageParam)
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < POSTS_PER_PAGE) return undefined
      return allPages.length * POSTS_PER_PAGE
    },
    initialPageParam: 0,
  })
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
      queryClient.invalidateQueries({ queryKey: ['postsWithAuthor'] })
      // Refresh the user's profile page to show their new post
      queryClient.invalidateQueries({
        queryKey: ['profilePosts', variables.userId],
      })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: Post) => API.deletePost(post),
    onSuccess: (_, variables) => {
      // Refresh the main feed to show the new post
      queryClient.invalidateQueries({ queryKey: ['postsWithAuthor'] })
      // Refresh the user's profile page to show their new post
      queryClient.invalidateQueries({
        queryKey: ['profilePosts', variables.userId],
      })
    },
  })
}
