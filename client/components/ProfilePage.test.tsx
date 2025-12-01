/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import '../tests/setup'

import { useParams, MemoryRouter } from 'react-router'
import { UseQueryResult } from '@tanstack/react-query'
import ProfilePage from './ProfilePage'
import {
  useUserProfile,
  useUserPosts,
  useFollowers,
  useFollowing,
} from '../hooks/useProfile'
import { User } from '../../models/user'
import { Post } from '../../models/post'

// -- Mocks --
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return {
    ...actual,
    useParams: vi.fn(),
  }
})

vi.mock('../hooks/useProfile', () => ({
  useUserProfile: vi.fn(),
  useUserPosts: vi.fn(),
  useFollowers: vi.fn(),
  useFollowing: vi.fn(),
  useEditUserProfilePicture: vi.fn(() => ({ mutate: vi.fn() })),
}))

// -- Test Data --
const mockAuthId = 'google-oauth2|test_user_id'
const mockUser: User = {
  id: 1,
  auth_id: mockAuthId,
  name: 'Test User',
  bio: 'This is a test bio.',
  font: '',
  profile_picture: 'test_profile.jpg',
}
const mockPosts: Post[] = [
  {
    id: 101,
    userId: mockAuthId,
    userName: 'Test User',
    imageUrl: 'post1.jpg',
    message: 'Hello World',
    dateAdded: '1678886400',
  },
]
const mockFollowers: User[] = [{ ...mockUser, id: 2, name: 'Follower One' }]
const mockFollowing: User[] = [{ ...mockUser, id: 3, name: 'Following One' }]

// -- Helper to create mock query results --
function createMockQueryResult<TData>(
  options: Partial<UseQueryResult<TData, Error>>,
): UseQueryResult<TData, Error> {
  const status =
    options.status ??
    (options.isLoading ? 'pending' : options.isError ? 'error' : 'success')

  const baseResult = {
    dataUpdatedAt: 0,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'idle',
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: true,
    refetch: vi.fn(),
    ...options,
  }

  if (status === 'success') {
    return {
      ...baseResult,
      status,
      data: options.data,
      error: null,
      isError: false,
      isLoading: false,
      isLoadingError: false,
      isSuccess: true,
    } as UseQueryResult<TData, Error>
  }

  if (status === 'error') {
    return {
      ...baseResult,
      status,
      data: undefined,
      error: options.error || new Error('Mock Error'),
      isError: true,
      isLoading: false,
      isLoadingError: true,
      isSuccess: false,
    } as UseQueryResult<TData, Error>
  }

  return {
    ...baseResult,
    status: 'pending',
    data: undefined,
    error: null,
    isError: false,
    isLoading: true,
    isLoadingError: false,
    isSuccess: false,
  } as UseQueryResult<TData, Error>
}

interface RenderOptions {
  userProfileState?: Partial<UseQueryResult<User, Error>>
  userPostsState?: Partial<UseQueryResult<Post[], Error>>
  followersState?: Partial<UseQueryResult<User[], Error>>
  followingState?: Partial<UseQueryResult<User[], Error>>
}

const renderComponent = (options: RenderOptions = {}) => {
  vi.mocked(useUserProfile).mockReturnValue(
    createMockQueryResult(options.userProfileState || {}),
  )
  vi.mocked(useUserPosts).mockReturnValue(
    createMockQueryResult(options.userPostsState || {}),
  )
  vi.mocked(useFollowers).mockReturnValue(
    createMockQueryResult(options.followersState || {}),
  )
  vi.mocked(useFollowing).mockReturnValue(
    createMockQueryResult(options.followingState || {}),
  )

  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  )
}

describe('ProfilePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useParams).mockReturnValue({ authId: mockAuthId })
  })

  it('should display a loading message if any hook is loading', () => {
    renderComponent({ userProfileState: { isLoading: true } })
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should display an error message if fetching the profile fails', () => {
    const error = new Error('Failed to fetch profile')
    renderComponent({ userProfileState: { isError: true, error } })
    const errorElement = screen.getByText(/Error loading profile/i)
    expect(errorElement).toBeInTheDocument()
    expect(errorElement.textContent).toContain('Failed to fetch profile')
  })

  it('should display "User profile not found" if profile data is undefined', async () => {
    renderComponent({
      userProfileState: { data: undefined, isSuccess: true },
    })
    await waitFor(() => {
      expect(screen.getByText('User profile not found.')).toBeInTheDocument()
    })
  })

  it('should display user details and interactive elements on success', async () => {
    renderComponent({
      userProfileState: { data: mockUser, isSuccess: true },
      userPostsState: { data: mockPosts, isSuccess: true },
      followersState: { data: mockFollowers, isSuccess: true },
      followingState: { data: mockFollowing, isSuccess: true },
    })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /Test User/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('This is a test bio.')).toBeInTheDocument()

      expect(screen.getByLabelText('View Followers')).toBeInTheDocument()
      expect(screen.getByLabelText('View Following')).toBeInTheDocument()

      expect(
        screen.getByRole('heading', { level: 2, name: /Posts/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })
  })

  it('should display "No posts yet." when the user has no posts', async () => {
    renderComponent({
      userProfileState: { data: mockUser, isSuccess: true },
      userPostsState: { data: [], isSuccess: true },
    })

    await waitFor(() => {
      expect(screen.getByText('No posts yet.')).toBeInTheDocument()
    })
  })
})
