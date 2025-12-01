import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchUserProfile,
  fetchUserPosts,
  fetchFollowers,
  fetchFollowing,
} from '../apis/users.js'
import { User } from '../../models/user.js'
import * as API from '../apis/users.ts'

export function useUserProfile(authId: string) {
  const query = useQuery({
    queryKey: ['profile', authId],
    queryFn: () => fetchUserProfile(authId),
  })
  return {
    ...query,
    // editProfilePic: useEditUserProfilePicture,
    // add more user queries/mutations here if needed later
  }
}

export function useEditUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (user: User) => API.editUser(user),
    onSuccess: (_, variables) => {
      // Refresh profile
      queryClient.invalidateQueries({
        queryKey: ['profile', variables.auth_id],
      })
    },
  })
}

export function useEditUserProfilePicture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { authId: string; profilePicture: string }) =>
      API.editUserProfilePicture(variables.authId, variables.profilePicture),
    onSuccess: (_, variable) => {
      // Refresh profile
      queryClient.invalidateQueries({
        queryKey: ['profile', variable.authId],
      })
    },
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
