import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import * as API from '../apis/posts.ts'

import { fetchAllPosts } from '../apis/posts'

export function usePosts() {
  const query = useQuery({ queryKey: ['posts'], queryFn: fetchAllPosts })
  return {
    ...query,
    add: useAddPost,
    // add more post queries/mutations here if needed later
  }
}

export function useEntryMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return mutation
}

export function useAddPost() {
  return useEntryMutation(API.addPost)
}
