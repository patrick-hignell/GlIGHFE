import { Post as PostType } from '../../models/post'
import { Image } from 'cloudinary-react'

interface Props {
  post: PostType
}

function Post({ post }: Props) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
  }
  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <h3 className="text-lg font-bold">{post.userName}</h3>
      {post.imageUrl && (
        <Image
          cloudName="dfjgv0mp6"
          publicId={post.imageUrl}
          width="300"
          crop="scale"
        />
      )}
      <p className="mt-2 text-gray-800">{post.message}</p>
      <p className="mt-1 text-sm text-gray-500">
        {new Date(post.dateAdded).toLocaleString('en-NZ', options)}
      </p>
    </div>
  )
}

export default Post
