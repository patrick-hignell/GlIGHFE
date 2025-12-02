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
    } as never)

    renderWithProviders(<MainFeed />)

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should display an error message when fetching posts fails', () => {
    vi.mocked(usePostsWithAuthor).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
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
      data: mockPosts,
      isLoading: false,
      isError: false,
    } as never)

    renderWithProviders(<MainFeed />)

    await waitFor(() => {
      expect(screen.getByText('Sofia')).toBeInTheDocument()
      expect(screen.getByText('Nikola')).toBeInTheDocument()
    })
  })
})
