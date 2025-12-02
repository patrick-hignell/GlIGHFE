import { useNavigate } from 'react-router'
import { CommentWithAuthor } from '../../models/comment'
import { Image } from 'cloudinary-react'
import { useAuth0 } from '@auth0/auth0-react'
import { useDeleteComment } from '../hooks/useComments'

export function Comment({ commentData }: { commentData: CommentWithAuthor }) {
  const publicId = commentData.profilePicture
  const navigate = useNavigate()
  const { user } = useAuth0()
  const { mutate: deleteMutate } = useDeleteComment()

  function handleProfileClick() {
    navigate(`/profile/${commentData.userId}`)
  }

  function handleDeleteClick() {
    // console.log('delete')
    // console.log(commentData)
    deleteMutate(commentData)
  }

  return (
    <div className="flex gap-2">
      <div className="mb-2 flex flex-1 flex-row gap-4 rounded-lg border bg-white p-2">
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
      {user?.sub === commentData.userId && (
        <button onClick={handleDeleteClick} className="text-right">
          <i className="bi bi-trash-fill text-3xl"></i>
        </button>
      )}
    </div>
  )
}
export default Comment
