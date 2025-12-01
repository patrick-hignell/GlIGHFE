import { useNavigate } from 'react-router'
import { CommentWithAuthor } from '../../models/comment'
import { Image } from 'cloudinary-react'

export function Comment({ commentData }: { commentData: CommentWithAuthor }) {
  const publicId = commentData.profilePicture
  const navigate = useNavigate()

  function handleProfileClick() {
    navigate(`/profile/${commentData.userId}`)
  }

  return (
    <div className="mb-2 flex flex-row gap-4 rounded-lg border bg-white p-2">
      <div className="flex h-16 w-16 items-center justify-center space-x-4 overflow-hidden rounded-full bg-gray-900 p-1 shadow-md">
        <button onClick={handleProfileClick}>
          <Image
            className="rounded-full"
            cloudName="dfjgv0mp6"
            publicId={publicId}
            alt={commentData.userName + "'s profile"}
            width="300"
            height="300"
            crop="fill"
          />
        </button>
      </div>

      {commentData.message && (
        <p className="flex items-center justify-center">
          {commentData.message}
        </p>
      )}
    </div>
  )
}
export default Comment
