import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getCommentsByPostId, addComment } from '../apis/comments'
import * as API from '../apis/comments.ts'
import { Comment } from '../../models/comment.ts'

export function useComments(postId: number) {
  const query = useQuery({
    queryKey: ['comments', postId],
    queryFn: ({ queryKey }) => {
      const postId = queryKey[1]
      return getCommentsByPostId(postId as number)
    },
  })
  return {
    ...query,
    addComment: useAddComment(),
  }
}

export function useCommentsMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
  return mutation
}

export function useAddComment() {
  return useCommentsMutation(addComment)
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (comment: Comment) => API.deleteComment(comment),
    onSuccess: (_, variables) => {
      // Refresh the comments of that post
      queryClient.invalidateQueries({
        queryKey: ['comments', Number(variables.postId)],
      })
    },
  })
}
