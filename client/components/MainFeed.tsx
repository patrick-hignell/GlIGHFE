import { useEffect, useRef } from 'react'
import { usePostsWithAuthor } from '../hooks/usePosts'
import Loading from './Loading'
import Post from './Post'

function MainFeed() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsWithAuthor()

  const observerTarget = useRef(null)

  // Infinite scroll detector
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <div>Error fetching posts</div>
  }

  // Flatten all pages into single array
  const posts = data?.pages.flatMap((page) => page) ?? []

  return (
    <div className="h-full p-4">
      <div className="pb-24">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}

        {/* Invisible trigger for infinite scroll */}
        <div ref={observerTarget} className="h-10" />

        {isFetchingNextPage && (
          <div className="py-4 text-center">Loading more...</div>
        )}
      </div>
    </div>
  )
}

export default MainFeed
