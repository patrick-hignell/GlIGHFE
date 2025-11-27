import { useQuery } from '@tanstack/react-query'
import { fetchAllPosts } from '../apis/posts'

export function usePosts() {
  const query = useQuery({ queryKey: ['posts'], queryFn: fetchAllPosts })
  return {
    ...query,
    // add more post queries/mutations here if needed later
  }
}
