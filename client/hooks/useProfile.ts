import { useQuery } from '@tanstack/react-query'
import {
  fetchUserProfile,
  fetchUserPosts,
  fetchFollowers,
  fetchFollowing,
} from '../apis/users.js'

export function useUserProfile(authId: string) {
  return useQuery({
    queryKey: ['profile', authId],
    queryFn: () => fetchUserProfile(authId),
  })
}

export function useUserPosts(authId: string) {
  return useQuery({
    queryKey: ['profilePosts', authId],
    queryFn: () => fetchUserPosts(authId),
  })
}

export function useFollowers(authId: string) {
  return useQuery({
    queryKey: ['profileFollowers', authId],
    queryFn: () => fetchFollowers(authId),
  })
}

export function useFollowing(authId: string) {
  return useQuery({
    queryKey: ['profileFollowing', authId],
    queryFn: () => fetchFollowing(authId),
  })
}
