import { PostWithAuthor } from '../../models/post'
import { CommentSection } from './CommentSection'
import { Image } from 'cloudinary-react'
import { useEditUserProfilePicture } from '../hooks/useProfile'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'

interface Props {
  post: PostWithAuthor
}

function Post({ post }: Props) {
  const { mutate } = useEditUserProfilePicture()
  const { user } = useAuth0()
  const navigate = useNavigate()
  // const options: Intl.DateTimeFormatOptions = {
  //   day: '2-digit',
  //   month: '2-digit',
  //   year: '2-digit',
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit',
  //   hour12: false, // Use 24-hour format
  // }
  function handleProfileClick() {
    mutate(
      { authId: post.userId, profilePicture: post.imageUrl },
      {
        onSuccess: () => {
          navigate(`/profile/${user?.sub}`)
        },
      },
    )
  }

  function handlePictureClick() {
    navigate(`/profile/${post.userId}`)
  }

  return (
    <div className="mb-4 flex max-w-[100rem] flex-col items-center rounded-lg bg-white p-4 shadow-md">
      <div className="flex w-full justify-between pb-4">
        <div className="flex h-16 w-16 items-center justify-center space-x-4 overflow-hidden rounded-full bg-gray-900 p-1 shadow-md">
          <button onClick={handlePictureClick}>
            <Image
              className="rounded-full"
              cloudName="dfjgv0mp6"
              publicId={post.profilePicture}
              alt={post.userName + "'s profile"}
              width="300"
              height="300"
              crop="fill"
            />
          </button>
        </div>
        <h3 className="text-4xl font-bold">{post.userName}</h3>
        {post.userId === user?.sub ? (
          <button onClick={handleProfileClick} className="text-right">
            <i className="bi bi-person-circle text-3xl"></i>
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {post.imageUrl && (
        <Image
          cloudName="dfjgv0mp6"
          publicId={post.imageUrl}
          // width="300"
          height="600"
          crop="limit"
        />
      )}
      <p className="mt-2 text-4xl text-gray-800">{post.message}</p>
      <CommentSection postId={post.id} />
      {/* <p className="mt-1 text-sm text-gray-500">
        {new Date(post.dateAdded).toLocaleString('en-NZ', options)}
      </p> */}
    </div>
  )
}

export default Post
