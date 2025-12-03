/**
 * @vitest-environment jsdom
 */

import '../tests/setup.ts'
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import MainFeed from './MainFeed'
import { usePostsWithAuthor } from '../hooks/usePosts'
import { PostWithAuthor } from '../../models/post'

// Mock IntersectionObserver for tests
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock hooks
vi.mock('../hooks/usePosts', () => ({
  usePostsWithAuthor: vi.fn(),
  useDeletePost: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}))
vi.mock('../hooks/useProfile', () => ({
  useEditUserProfilePicture: vi.fn(() => ({ mutate: vi.fn() })),
}))
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: vi.fn() }
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MainFeed component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display a loading message when posts are loading', () => {
    vi.mocked(usePostsWithAuthor).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as never)

    renderWithProviders(<MainFeed />)

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should display an error message when fetching posts fails', () => {
    vi.mocked(usePostsWithAuthor).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as never)

    renderWithProviders(<MainFeed />)

    expect(screen.getByText('Error fetching posts')).toBeInTheDocument()
  })

  it('should display a list of posts when data is successfully fetched', async () => {
    const mockPosts: PostWithAuthor[] = [
      {
        id: 1,
        userId: '1',
        userName: 'Sofia',
        message: 'Post 1',
        imageUrl: '',
        dateAdded: '',
        profilePicture: 'sofia.jpg',
      },
      {
        id: 2,
        userId: '2',
        userName: 'Nikola',
        message: 'Post 2',
        imageUrl: '',
        dateAdded: '',
        profilePicture: 'nikola.jpg',
      },
    ]

    vi.mocked(usePostsWithAuthor).mockReturnValue({
      data: {
        pages: [mockPosts], // Infinite query format: array of pages
        pageParams: [0],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as never)

    renderWithProviders(<MainFeed />)

    await waitFor(() => {
      expect(screen.getByText('Sofia')).toBeInTheDocument()
      expect(screen.getByText('Nikola')).toBeInTheDocument()
    })
  })

  it('should display "Loading more..." when fetching next page', async () => {
    const mockPosts: PostWithAuthor[] = [
      {
        id: 1,
        userId: '1',
        userName: 'Sofia',
        message: 'Post 1',
        imageUrl: '',
        dateAdded: '',
        profilePicture: 'sofia.jpg',
      },
    ]

    vi.mocked(usePostsWithAuthor).mockReturnValue({
      data: {
        pages: [mockPosts],
        pageParams: [0],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: true, // ← Key: Currently loading more
    } as never)

    renderWithProviders(<MainFeed />)

    await waitFor(() => {
      expect(screen.getByText('Loading more...')).toBeInTheDocument()
    })
  })

  it('should not show loading indicator when no more posts available', async () => {
    const mockPosts: PostWithAuthor[] = [
      {
        id: 1,
        userId: '1',
        userName: 'Sofia',
        message: 'Post 1',
        imageUrl: '',
        dateAdded: '',
        profilePicture: 'sofia.jpg',
      },
    ]

    vi.mocked(usePostsWithAuthor).mockReturnValue({
      data: {
        pages: [mockPosts],
        pageParams: [0],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false, // ← No more pages available
      isFetchingNextPage: false,
    } as never)

    renderWithProviders(<MainFeed />)

    await waitFor(() => {
      expect(screen.queryByText('Loading more...')).not.toBeInTheDocument()
    })
  })

  it('should display posts from multiple pages', async () => {
    const page1: PostWithAuthor[] = [
      {
        id: 1,
        userId: '1',
        userName: 'Sofia',
        message: 'Post 1',
        imageUrl: '',
        dateAdded: '',
        profilePicture: 'sofia.jpg',
      },
    ]

    const page2: PostWithAuthor[] = [
      {
        id: 2,
        userId: '2',
        userName: 'Nikola',
        message: 'Post 2',
        imageUrl: '',
        dateAdded: '',
        profilePicture: 'nikola.jpg',
      },
    ]

    vi.mocked(usePostsWithAuthor).mockReturnValue({
      data: {
        pages: [page1, page2], // ← Multiple pages loaded
        pageParams: [0, 10],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as never)

    renderWithProviders(<MainFeed />)

    await waitFor(() => {
      expect(screen.getByText('Sofia')).toBeInTheDocument()
      expect(screen.getByText('Nikola')).toBeInTheDocument()
    })
  })
})
