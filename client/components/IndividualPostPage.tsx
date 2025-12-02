import { useParams } from 'react-router-dom'
import { useGetPostById } from '../hooks/usePosts.ts'
import Loading from './Loading.tsx'
import Post from './Post.tsx'

export default function IndividualPostPage() {
  const { id } = useParams()
  const postId = Number(id)

  const { data: post, isError, isLoading } = useGetPostById(postId)

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <div>Error loading post.</div>
  }

  if (!post) {
    return <div>Post not found.</div>
  }

  return (
    <div className="mt-5 flex h-full items-center justify-center bg-gray-100 p-4">
      <Post post={post} />
    </div>
  )
}
