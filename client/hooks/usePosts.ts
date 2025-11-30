import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as API from '../apis/posts.ts'
import { fetchAllPosts } from '../apis/posts'
import { PostData } from '../../models/post.ts'
// import { post } from 'superagent'

export function usePosts() {
  const query = useQuery({ queryKey: ['posts'], queryFn: fetchAllPosts })
  return {
    ...query,
    add: useAddPost,
    // add more post queries/mutations here if needed later
  }
}

// export function useEntryMutation<TData = unknown, TVariables = unknown>(
//   mutationFn: MutationFunction<TData, TVariables>,
// ) {
//   const queryClient = useQueryClient()

//   const mutation = useMutation({
//     mutationFn,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] })
//     },
//   })

//   return mutation
// }

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
