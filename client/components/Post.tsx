import { Post as PostType } from '../../models/post'
import { Image } from 'cloudinary-react'
import { useEditUserProfilePicture } from '../hooks/useProfile'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'

interface Props {
  post: PostType
}

function Post({ post }: Props) {
  const { mutate } = useEditUserProfilePicture()
  const { user, isAuthenticated } = useAuth0()
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

  return (
    <div className="mb-4 flex flex-col items-center rounded-lg bg-white p-4 shadow-md">
      {user?.sub === post.userId && isAuthenticated ? (
        <div className="flex w-full justify-between">
          <div></div>
          <h3 className="text-lg font-bold">{post.userName}</h3>
          <button onClick={handleProfileClick} className="text-right">
            <i className="bi bi-person-circle text-xl"></i>
          </button>
        </div>
      ) : (
        <h3 className="text-2xl font-bold">{post.userName}</h3>
      )}

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
      {/* <p className="mt-1 text-sm text-gray-500">
        {new Date(post.dateAdded).toLocaleString('en-NZ', options)}
      </p> */}
    </div>
  )
}

export default Post
