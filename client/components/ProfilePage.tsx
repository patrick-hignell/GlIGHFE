import { useParams } from 'react-router'
import { FormEvent, useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAuth0 } from '@auth0/auth0-react'
import {
  useUserProfile,
  useUserPosts,
  useFollowers,
  useFollowing,
  useFollowUser,
  useUnfollowUser,
  useEditUserProfile,
} from '../hooks/useProfile.js'
import FollowListModal from './FollowListModal'
import Post from './Post.js'
import Loading from './Loading.js'
import { Image } from 'cloudinary-react'
import { UserWithSelection } from '../../models/user.js'
import EmojiPicker, {
  Categories,
  EmojiClickData,
  EmojiStyle,
} from 'emoji-picker-react'
import GraphemeSplitter from 'grapheme-splitter'

function ProfilePage() {
  const emptyFormState = {
    id: 0,
    authId: '',
    name: '',
    bio: '',
    font: '',
    profilePicture: '',
    selection: 'name',
    emojis: false,
  } as UserWithSelection

  const { user, getAccessTokenSilently } = useAuth0()
  const { authId } = useParams<{ authId: string }>()
  const [editMode, setEditMode] = useState(false)
  const [formState, setFormState] = useState<UserWithSelection>(emptyFormState)
  const charLimit = 30
  const splitter = new GraphemeSplitter()
  const currentAuthId = user?.sub

  // Initialise follow/unfollow mutations with current user's authId for cache invalidation
  const followMutation = useFollowUser(currentAuthId)
  const unfollowMutation = useUnfollowUser(currentAuthId)

  // Fetch user data using custom hooks
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

  const { mutate } = useEditUserProfile()

  useEffect(() => {
    if (userProfile) {
      setFormState((prev) => ({
        ...prev,
        bio: userProfile.bio,
        name: userProfile.name,
        id: userProfile.id,
      }))
    }
  }, [userProfile])

  // Manage follow list modal state
  const [modalView, setModalView] = useState<'followers' | 'following' | null>(
    null,
  )

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

  // Handle errors from any data fetching hook
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

  // Check if current user is following this profile
  const isFollowing = followers?.some((f) => f.auth_id === currentAuthId)

  // Combined handler for follow/unfollow actions
  const handleFollowAction = async (action: 'follow' | 'unfollow') => {
    try {
      const token = await getAccessTokenSilently()
      if (!authId) return

      if (action === 'follow') {
        followMutation.mutate({ authIdToFollow: authId, token })
      } else {
        unfollowMutation.mutate({ authIdToUnfollow: authId, token })
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error)
    }
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    if (user) {
      mutate({
        user: {
          ...formState,
          profilePicture: userProfile.profile_picture,
          authId: user.sub as string,
          id: userProfile.id,
        },
      })
    }
  }

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setFormState((previousData) => {
      const fieldToUpdate = previousData.selection === 'bio' ? 'bio' : 'name'
      const currentValue = previousData[fieldToUpdate]

      if (
        splitter.countGraphemes(currentValue + emojiObject.emoji) <= charLimit
      ) {
        return {
          ...previousData,
          [fieldToUpdate]: currentValue + emojiObject.emoji,
        }
      }

      return previousData
    })
  }

  function handleEmojiSelection(target: string) {
    setFormState((previousData) => {
      return {
        ...previousData,
        selection: target === 'emoji' ? previousData.selection : target,
        emojis: target === 'emoji' ? !previousData.emojis : previousData.emojis,
      }
    })
  }

  return (
    <div className="h-full">
      {/* Profile Header */}
      <div className="mb-4 flex w-screen items-center justify-between space-x-4 bg-[#b9db97] p-2 align-middle shadow-md">
        <div className="flex gap-3">
          {/* Profile Picture */}
          <div className="grid place-items-center">
            <div className="flex h-20 w-20 items-center space-x-4 overflow-hidden rounded-full shadow-md">
              {userProfile.profile_picture && (
                <Image
                  className="rounded-full border-2 border-[#424242]"
                  cloudName="dfjgv0mp6"
                  publicId={userProfile.profile_picture}
                  width="300"
                  height="300"
                  crop="fill"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            {editMode ? (
              <div>
                <form
                  onSubmit={(e) => {
                    handleSubmit(e)
                    setFormState((previousData) => {
                      return {
                        ...previousData,
                        emojis: false,
                        selection: 'name',
                      }
                    })
                    setEditMode(false)
                  }}
                >
                  <div className="flex">
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder=""
                      className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body block w-full rounded-lg border border-black px-3 py-2 text-sm"
                      value={formState.name}
                      onChange={handleChange}
                      onClick={() => handleEmojiSelection('name')}
                    />
                    <button
                      className="pl-2 text-2xl"
                      type="button"
                      onClick={() => handleEmojiSelection('emoji')}
                    >
                      😀
                    </button>
                    <button type="submit">
                      <i className="bi bi-send-fill pl-2 text-2xl text-black"></i>
                    </button>
                  </div>
                  <div className="flex">
                    <label htmlFor="bio" className="sr-only">
                      Bio:
                    </label>
                    <input
                      type="text"
                      id="bio"
                      name="bio"
                      placeholder=""
                      className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body block w-full rounded-lg border border-black px-3 py-2.5 text-sm"
                      value={formState.bio}
                      onChange={handleChange}
                      onClick={() => handleEmojiSelection('bio')}
                    />
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <h1 className="-mb-2 text-3xl font-bold text-black">
                  {userProfile.name}
                </h1>
                <p className="italic text-gray-900">
                  {userProfile.bio || 'No bio provided.'}
                </p>
              </div>
            )}

            {/* Followers, Following, and Follow/Unfollow buttons */}
            <div className="flex space-x-4">
              {/* Followers/Following modal buttons */}
              <div className="flex space-x-4">
                <button
                  className="flex items-center space-x-1 text-black hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  onClick={() => setModalView('followers')}
                  aria-label="View Followers"
                >
                  <i className="bi bi-people text-2xl"></i>
                </button>
                <button
                  className="flex items-center space-x-1 text-black hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  onClick={() => setModalView('following')}
                  aria-label="View Following"
                >
                  <i className="bi bi-person-check text-2xl"></i>
                </button>
              </div>

              {/* Follow/Unfollow button - only shown when viewing another user's profile */}
              {currentAuthId && currentAuthId !== authId && (
                <button
                  onClick={() =>
                    handleFollowAction(isFollowing ? 'unfollow' : 'follow')
                  }
                  disabled={
                    followMutation.isPending || unfollowMutation.isPending
                  }
                  className={`ml-4 rounded px-3 py-1 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    isFollowing
                      ? 'bg-[#d16009] text-white hover:bg-[#f9927d] focus:ring-gray-500'
                      : 'bg-[#d848a8] text-white hover:bg-[#f03fb5] focus:ring-blue-500'
                  }`}
                >
                  {followMutation.isPending || unfollowMutation.isPending ? (
                    '...'
                  ) : isFollowing ? (
                    <i className="bi bi-person-dash text-2xl"></i>
                  ) : (
                    <i className="bi bi-person-add text-2xl"></i>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Edit button - only visible on own profile */}
        <div className="flex flex-col justify-start self-start">
          {user?.sub === authId && (
            <button
              onClick={() => {
                setEditMode((prevMode) => !prevMode)
                setFormState((previousData) => {
                  return {
                    ...previousData,
                    emojis: false,
                    selection: 'name',
                  }
                })
              }}
            >
              <i
                className={`bi ${editMode ? 'bi-pencil' : 'bi-pencil-fill'} text-black text-2xl  `}
              ></i>
            </button>
          )}
        </div>
      </div>
      {formState.emojis && (
        <EmojiPicker
          categories={[
            { category: 'suggested' as Categories, name: '' },
            { category: 'smileys_people' as Categories, name: '' },
            { category: 'animals_nature' as Categories, name: '' },
            { category: 'food_drink' as Categories, name: '' },
            { category: 'travel_places' as Categories, name: '' },
            { category: 'activities' as Categories, name: '' },
            { category: 'objects' as Categories, name: '' },
            { category: 'symbols' as Categories, name: '' },
            { category: 'flags' as Categories, name: '' },
          ]}
          previewConfig={{
            defaultEmoji: '1f60a',
            defaultCaption: '',
            showPreview: false,
          }}
          className=""
          width="full"
          onEmojiClick={onEmojiClick}
          emojiStyle={EmojiStyle.NATIVE}
          searchPlaceHolder=""
        />
      )}

      {/* Posts Section */}
      {userPosts && userPosts.length > 0 ? (
        <div className="flex flex-col gap-4 p-2">
          {userPosts.map((post) => (
            <Post key={post.id} post={post} editMode={editMode} />
          ))}
        </div>
      ) : (
        <p className="hidden text-gray-400">No posts yet.</p>
      )}

      {/* Follow List Modals */}
      {followers && (
        <FollowListModal
          isOpen={modalView === 'followers'}
          onClose={() => setModalView(null)}
          title="Followers"
          users={followers}
        />
      )}

      {following && (
        <FollowListModal
          isOpen={modalView === 'following'}
          onClose={() => setModalView(null)}
          title="Following"
          users={following}
        />
      )}
    </div>
  )
}

export default ProfilePage
