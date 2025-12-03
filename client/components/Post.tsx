import { PostWithAuthor } from '../../models/post'
import { CommentSection } from './CommentSection'
import { Image } from 'cloudinary-react'
import { useEditUserProfilePicture } from '../hooks/useProfile'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'
import { useDeletePost } from '../hooks/usePosts'
import PostLink from './common/PostLink'

interface Props {
  post: PostWithAuthor
  editMode?: boolean
}

function Post({ post, editMode = false }: Props) {
  const { mutate } = useEditUserProfilePicture()
  const { mutate: deleteMutate } = useDeletePost()
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

  function handleDeleteClick() {
    deleteMutate(post)
  }

  return (
    <div className="mb-4 flex max-w-[100rem] flex-col items-center rounded-lg border-2 border-[#9dc5744d] bg-white p-2 shadow-md">
      <div className="flex w-full items-center justify-start pb-2">
        <div className="flex h-14 max-h-14 w-14 max-w-14 items-center justify-center overflow-hidden rounded-full  p-1 shadow-sm">
          <button onClick={handlePictureClick}>
            <Image
              className="h-14 max-h-14 w-14 max-w-14 rounded-full border-2 border-[#9cc574]"
              cloudName="dfjgv0mp6"
              publicId={post.profilePicture}
              alt={post.userName + "'s profile"}
              crop="fill"
            />
          </button>
        </div>
        <h3 className="pl-2 text-xl font-bold">{post.userName}</h3>
        {editMode ? (
          <div>
            <button onClick={handleProfileClick} className="text-right">
              <i className="bi bi-person-circle text-3xl"></i>
            </button>
            <button onClick={handleDeleteClick} className="text-right">
              <i className="bi bi-trash-fill text-3xl"></i>
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <hr className="mb-2 h-px  w-full bg-[#caf3a2]" />
      <PostLink id={post.id}>
        {post.imageUrl && (
          <Image
            cloudName="dfjgv0mp6"
            publicId={post.imageUrl}
            // width="300"
            height="600"
            crop="limit"
          />
        )}
      </PostLink>
      <p className="mb-2 mt-2 text-lg text-gray-800">{post.message}</p>

      <CommentSection postId={post.id} />
    </div>
  )
}

export default Post
