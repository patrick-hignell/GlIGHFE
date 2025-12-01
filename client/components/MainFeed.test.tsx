/**
 * @vitest-environment jsdom
 */

import '../tests/setup.ts'
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import MainFeed from './MainFeed'
import { usePosts } from '../hooks/usePosts'
import { Post } from '../../models/post'

// Mock all necessary hooks
vi.mock('../hooks/usePosts')
vi.mock('../hooks/useProfile', () => ({
  useEditUserProfilePicture: vi.fn(() => ({ mutate: vi.fn() })),
}))
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: vi.fn() }
})

// Helper to render components with required providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MainFeed component', () => {
  it('should display a loading message when posts are loading', () => {
    vi.mocked(usePosts).mockReturnValue({
      isLoading: true,
    } as ReturnType<typeof usePosts>)

    renderWithProviders(<MainFeed />)

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should display an error message when fetching posts fails', () => {
    vi.mocked(usePosts).mockReturnValue({
      isError: true,
    } as ReturnType<typeof usePosts>)

    renderWithProviders(<MainFeed />)

    expect(screen.getByText('Error fetching posts')).toBeInTheDocument()
  })

  it('should display a list of posts when data is successfully fetched', async () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        userId: '1',
        userName: 'Sofia',
        message: 'Post 1',
        imageUrl: '',
        dateAdded: '',
      },
      {
        id: 2,
        userId: '2',
        userName: 'Nikola',
        message: 'Post 2',
        imageUrl: '',
        dateAdded: '',
      },
    ]

    vi.mocked(usePosts).mockReturnValue({
      data: mockPosts,
      isSuccess: true,
    } as ReturnType<typeof usePosts>)

    renderWithProviders(<MainFeed />)

    await waitFor(() => {
      expect(screen.getByText('Sofia')).toBeInTheDocument()
      expect(screen.getByText('Nikola')).toBeInTheDocument()
    })
  })
})
