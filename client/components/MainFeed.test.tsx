/**
 * @vitest-environment jsdom
 */

import '../tests/setup.ts'
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import MainFeed from './MainFeed'
import { usePosts } from '../hooks/usePosts'
import { Post } from '../../models/post'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the usePosts hook
vi.mock('../hooks/usePosts', () => ({
  usePosts: vi.fn(),
}))

// A more robust helper for creating a type-safe mock value for usePosts
const createMockUsePostsValue = (
  overrides: Partial<ReturnType<typeof usePosts>> = {},
): ReturnType<typeof usePosts> => {
  const defaultValues = {
    data: undefined,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: false,
    status: 'pending',
    dataUpdatedAt: 0,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'idle',
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: () => Promise.resolve({} as unknown),
  }

  return { ...defaultValues, ...overrides } as ReturnType<typeof usePosts>
}

describe('MainFeed component', () => {
  it('should display a loading message when posts are loading', () => {
    // Arrange
    const queryClient = new QueryClient()
    vi.mocked(usePosts).mockReturnValue(
      createMockUsePostsValue({ isLoading: true, status: 'pending' }),
    )

    // Act

    render(
      <QueryClientProvider client={queryClient}>
        <MainFeed />
      </QueryClientProvider>,
    )

    // Assert
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should display an error message when fetching posts fails', () => {
    // Arrange
    const queryClient = new QueryClient()
    vi.mocked(usePosts).mockReturnValue(
      createMockUsePostsValue({ isError: true, status: 'error' }),
    )

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MainFeed />
      </QueryClientProvider>,
    )

    // Assert
    expect(screen.getByText('Error fetching posts')).toBeInTheDocument()
  })

  it('should display a list of posts when data is successfully fetched', async () => {
    // Arrange
    const queryClient = new QueryClient()
    const mockPosts: Post[] = [
      {
        id: 1,
        userId: 1,
        userName: 'Sofia',
        imageUrl: 'img1.jpg',
        message: 'Post 1',
        dateAdded: 1,
      },
      {
        id: 2,
        userId: 2,
        userName: 'Nikola',
        imageUrl: 'img2.jpg',
        message: 'Post 2',
        dateAdded: 2,
      },
    ]

    vi.mocked(usePosts).mockReturnValue(
      createMockUsePostsValue({
        data: mockPosts,
        isSuccess: true,
        status: 'success',
      }),
    )

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MainFeed />
      </QueryClientProvider>,
    )

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Main Feed')).toBeInTheDocument()
      expect(screen.getByText('Sofia')).toBeInTheDocument()
      expect(screen.getByText('Nikola')).toBeInTheDocument()
    })
  })
})
