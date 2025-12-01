import { usePosts } from '../hooks/usePosts'
import Loading from './Loading'
import Post from './Post'

function MainFeed() {
  const { data: posts, isLoading, isError } = usePosts()

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <div>Error fetching posts</div>
  }

  return (
    <div className="h-screen overflow-y-auto p-4">
      {/* <h2 className="mb-4 text-2xl font-bold">Main Feed</h2> */}
      <div>
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default MainFeed
