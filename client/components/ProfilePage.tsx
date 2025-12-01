import { useParams } from 'react-router'
import {
  useUserProfile,
  useUserPosts,
  useFollowers,
  useFollowing,
} from '../hooks/useProfile.js'
import Post from './Post.js'
import Loading from './Loading.js'
import { Image } from 'cloudinary-react'

function ProfilePage() {
  const { authId } = useParams<{ authId: string }>()

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useUserProfile(authId || '')

  const {
    data: userPosts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useUserPosts(authId || '')

  const {
    data: followers,
    isLoading: isFollowersLoading,
    isError: isFollowersError,
    error: followersError,
  } = useFollowers(authId || '')

  const {
    data: following,
    isLoading: isFollowingLoading,
    isError: isFollowingError,
    error: followingError,
  } = useFollowing(authId || '')

  if (!authId) {
    return <p className="text-red-500">Error: User ID not provided in URL.</p>
  }

  if (
    isProfileLoading ||
    isPostsLoading ||
    isFollowersLoading ||
    isFollowingLoading
  ) {
    return <Loading />
  }

  const errorStates = [
    { isError: isProfileError, error: profileError, label: 'profile' },
    { isError: isPostsError, error: postsError, label: 'posts' },
    { isError: isFollowersError, error: followersError, label: 'followers' },
    {
      isError: isFollowingError,
      error: followingError,
      label: 'following list',
    },
  ]

  const firstError = errorStates.find((s) => s.isError)

  if (firstError) {
    return (
      <p className="text-red-500">
        Error loading {firstError.label}:{' '}
        {firstError.error instanceof Error
          ? firstError.error.message
          : 'Unknown error'}
      </p>
    )
  }

  if (!userProfile) {
    return <p className="text-red-500">User profile not found.</p>
  }

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header */}
      <div className="mb-6 flex items-center space-x-4 rounded-lg bg-gray-800 p-4 shadow-md">
        {/* <img
          src={userProfile.profile_picture || 'https://via.placeholder.com/150'} // Placeholder image
          alt={`${userProfile.name}'s profile`}
          className="h-24 w-24 rounded-full border-4 border-purple-500 object-cover"
        /> */}
        <div className="mb-6 flex h-48 w-48 items-center space-x-4 overflow-hidden rounded-[100%] bg-gray-900 shadow-md">
          {userProfile.profile_picture && (
            <div className="-m-0">
              <Image
                cloudName="dfjgv0mp6"
                publicId={userProfile.profile_picture}
                width="192"
                height="192"
                crop="fill"
              />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{userProfile.name}</h1>
          <p className="italic text-gray-300">
            {userProfile.bio || 'No bio provided.'}
          </p>
          <div className="mt-2 flex space-x-4">
            <span className="text-gray-400">
              <strong className="text-white">{userPosts?.length || 0}</strong>{' '}
              Posts
            </span>
            <span className="text-gray-400">
              <strong className="text-white">{followers?.length || 0}</strong>{' '}
              Followers
            </span>
            <span className="text-gray-400">
              <strong className="text-white">{following?.length || 0}</strong>{' '}
              Following
            </span>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <h2 className="mb-4 text-2xl font-semibold text-white">Posts</h2>
      {userPosts && userPosts.length > 0 ? (
        <div className="flex flex-col gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No posts yet.</p>
      )}

      {/* Placeholder for Liked Posts (Stretch Goal) */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold text-white">
        Liked Posts (Stretch Goal)
      </h2>
      <p className="text-gray-400">
        Functionality to display liked posts will be added here.
      </p>
    </div>
  )
}

export default ProfilePage
