/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import '../tests/setup'

import { useParams, MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProfilePage from './ProfilePage'
import {
  useUserProfile,
  useUserPosts,
  useFollowers,
  useFollowing,
  useFollowUser,
  useUnfollowUser,
  useEditUserProfilePicture,
  useEditUserProfile,
} from '../hooks/useProfile'
import { useAuth0 } from '@auth0/auth0-react'
import { User } from '../../models/user'
import { PostWithAuthor } from '../../models/post'

// Mock modules
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useParams: vi.fn(),
}))

vi.mock('../hooks/useProfile')
vi.mock('@auth0/auth0-react')
vi.mock('cloudinary-react', () => ({
  Image: ({ publicId }: { publicId: string }) => (
    <img src={publicId} alt="profile" />
  ),
}))

// Test data
const mockAuthId = 'google-oauth2|test_user_id'
const mockUser: User = {
  id: 1,
  auth_id: mockAuthId,
  name: 'Test User',
  bio: 'This is a test bio.',
  font: '',
  profile_picture: 'test_profile.jpg',
}

const mockPosts: PostWithAuthor[] = [
  {
    id: 101,
    userId: mockAuthId,
    userName: 'Test User',
    imageUrl: 'post1.jpg',
    message: 'Hello World',
    dateAdded: '1678886400',
    profilePicture: 'test_profile.jpg',
  },
]

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

describe('ProfilePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useParams).mockReturnValue({ authId: mockAuthId })
    vi.mocked(useAuth0).mockReturnValue({
      user: { sub: 'auth0|test_user_id' },
      getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token'),
    } as never)

    // Mock useEditUserProfilePicture (used by Post component)
    vi.mocked(useEditUserProfilePicture).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never)

    // Default successful state
    vi.mocked(useUserProfile).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
    } as never)
    vi.mocked(useUserPosts).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as never)
    vi.mocked(useFollowers).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as never)
    vi.mocked(useFollowing).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as never)
    vi.mocked(useFollowUser).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never)
    vi.mocked(useUnfollowUser).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never)
    vi.mocked(useEditUserProfile).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never)
  })

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </QueryClientProvider>,
    )
  }

  it('should display loading state', () => {
    vi.mocked(useUserProfile).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as never)

    renderComponent()
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should display error message', () => {
    vi.mocked(useUserProfile).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch profile'),
    } as never)

    renderComponent()
    expect(screen.getByText(/Error loading profile/i)).toBeInTheDocument()
  })

  it('should display user profile', async () => {
    vi.mocked(useUserPosts).mockReturnValue({
      data: mockPosts,
      isLoading: false,
      isError: false,
    } as never)

    renderComponent()

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Test User' }),
      ).toBeInTheDocument()
      expect(screen.getByText('This is a test bio.')).toBeInTheDocument()
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })
  })

  it('should display "No posts yet" when user has no posts', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('No posts yet.')).toBeInTheDocument()
    })
  })

  it('should show Follow button on another user profile', async () => {
    vi.mocked(useParams).mockReturnValue({ authId: 'another_user_id' })
    vi.mocked(useUserProfile).mockReturnValue({
      data: { ...mockUser, auth_id: 'another_user_id' },
      isLoading: false,
      isError: false,
    } as never)

    renderComponent()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const followButton = buttons.find((btn) =>
        btn.querySelector('.bi-person-add'),
      )
      expect(followButton).toBeInTheDocument()
    })
  })

  it('should show Following button when already following', async () => {
    vi.mocked(useParams).mockReturnValue({ authId: 'another_user_id' })
    vi.mocked(useUserProfile).mockReturnValue({
      data: { ...mockUser, auth_id: 'another_user_id' },
      isLoading: false,
      isError: false,
    } as never)
    vi.mocked(useFollowers).mockReturnValue({
      data: [{ ...mockUser, auth_id: 'auth0|test_user_id' }],
      isLoading: false,
      isError: false,
    } as never)

    renderComponent()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const unfollowButton = buttons.find((btn) =>
        btn.querySelector('.bi-person-dash'),
      )
      expect(unfollowButton).toBeInTheDocument()
    })
  })

  it('should not show Follow button on own profile', async () => {
    vi.mocked(useAuth0).mockReturnValue({
      user: { sub: mockAuthId },
      getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token'),
    } as never)

    renderComponent()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const followButton = buttons.find(
        (btn) =>
          btn.querySelector('.bi-person-add') ||
          btn.querySelector('.bi-person-dash'),
      )
      expect(followButton).toBeUndefined()
    })
  })

  it('should call follow mutation when Follow button clicked', async () => {
    const mockFollowMutate = vi.fn()
    vi.mocked(useParams).mockReturnValue({ authId: 'another_user_id' })
    vi.mocked(useUserProfile).mockReturnValue({
      data: { ...mockUser, auth_id: 'another_user_id' },
      isLoading: false,
      isError: false,
    } as never)
    vi.mocked(useFollowUser).mockReturnValue({
      mutate: mockFollowMutate,
      isPending: false,
    } as never)

    renderComponent()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const followButton = buttons.find((btn) =>
        btn.querySelector('.bi-person-add'),
      )

      if (followButton) {
        fireEvent.click(followButton)
        expect(mockFollowMutate).toHaveBeenCalledWith({
          authIdToFollow: 'another_user_id',
          token: 'mock-token',
        })
      }
    })
  })

  it('should call unfollow mutation when Following button clicked', async () => {
    const mockUnfollowMutate = vi.fn()
    vi.mocked(useParams).mockReturnValue({ authId: 'another_user_id' })
    vi.mocked(useUserProfile).mockReturnValue({
      data: { ...mockUser, auth_id: 'another_user_id' },
      isLoading: false,
      isError: false,
    } as never)
    vi.mocked(useFollowers).mockReturnValue({
      data: [{ ...mockUser, auth_id: 'auth0|test_user_id' }],
      isLoading: false,
      isError: false,
    } as never)
    vi.mocked(useUnfollowUser).mockReturnValue({
      mutate: mockUnfollowMutate,
      isPending: false,
    } as never)

    renderComponent()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const unfollowButton = buttons.find((btn) =>
        btn.querySelector('.bi-person-dash'),
      )

      if (unfollowButton) {
        fireEvent.click(unfollowButton)
        expect(mockUnfollowMutate).toHaveBeenCalledWith({
          authIdToUnfollow: 'another_user_id',
          token: 'mock-token',
        })
      }
    })
  })
})
