import { Post as PostType } from '../../models/post'

interface Props {
  post: PostType
}

function Post({ post }: Props) {
  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <h3 className="text-lg font-bold">{post.userName}</h3>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.message || `A post by ${post.userName}`}
          className="mt-2 h-auto w-full rounded-md"
        />
      )}
      <p className="mt-2 text-gray-800">{post.message}</p>
      <p className="mt-1 text-sm text-gray-500">
        {new Date(post.dateAdded * 1000).toLocaleDateString()}
      </p>
    </div>
  )
}
export default Post
