import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchUserProfile,
  fetchUserPosts,
  fetchFollowers,
  fetchFollowing,
} from '../apis/users.js'
import { User, UserWithSelection } from '../../models/user.js'
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

export function useEditUserProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { user: UserWithSelection }) =>
      API.editUserProfile(variables.user),
    onSuccess: (_, variable) => {
      // Refresh profile
      queryClient.invalidateQueries({
        queryKey: ['profile', variable.user.authId],
      })
      queryClient.invalidateQueries({
        queryKey: ['profilePosts', variable.user.authId],
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

export function useFollowUser(currentAuthId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      authIdToFollow,
      token,
    }: {
      authIdToFollow: string
      token: string
    }) => API.followUser(authIdToFollow, token),
    onSuccess: (_, { authIdToFollow }) => {
      queryClient.invalidateQueries({
        queryKey: ['profileFollowers', authIdToFollow],
      })
      if (currentAuthId) {
        queryClient.invalidateQueries({
          queryKey: ['profileFollowing', currentAuthId],
        })
      }
    },
    onError: (error) => {
      console.error('Failed to follow user:', error)
    },
  })
}

export function useUnfollowUser(currentAuthId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      authIdToUnfollow,
      token,
    }: {
      authIdToUnfollow: string
      token: string
    }) => API.unfollowUser(authIdToUnfollow, token),
    onSuccess: (_, { authIdToUnfollow }) => {
      queryClient.invalidateQueries({
        queryKey: ['profileFollowers', authIdToUnfollow],
      })
      if (currentAuthId) {
        queryClient.invalidateQueries({
          queryKey: ['profileFollowing', currentAuthId],
        })
      }
    },
    onError: (error) => {
      console.error('Failed to unfollow user:', error)
    },
  })
}
