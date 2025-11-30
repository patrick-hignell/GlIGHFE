import { useState } from 'react'
import { PhotoUploader } from './PhotoUploader'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'
import { PostData } from '../../models/post'
import { useAddPost } from '../hooks/usePosts'

function UploadPage() {
  const [imageId, setImageId] = useState('kitten')
  const [charLimit, setCharLimit] = useState(10)

  const { user, isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<Omit<PostData, 'userId'>>({
    message: '',
    imageUrl: imageId,
    charLimit: charLimit,
    font: '',
    public: true,
  })

  const { mutate, isPending, isError } = useAddPost()

  function handleImageChange(newImage: string) {
    setImageId(newImage)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Number(e.target.value)
    setCharLimit(newLimit)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!isAuthenticated || !user?.sub) {
      console.error(
        'Submission failed: User is not authenticated or ID is unavailable.',
      )
      return
    }

    const submissionData: PostData = {
      ...formData,
      userId: user.sub,
      imageUrl: imageId,
      charLimit: charLimit,
    }

    mutate(submissionData, {
      onSuccess: () => {
        navigate('/feed')
      },
    })
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col">
        <PhotoUploader image={imageId} onImageChange={handleImageChange} />
        <br />
        <form onSubmit={handleSubmit}>
          <label htmlFor="limit">Limit</label>
          <input
            name="limit"
            onChange={handleLimitChange}
            id="limit"
            type="number"
            max={20}
            value={charLimit}
          ></input>
          <br />
          <label htmlFor="caption">Caption</label>
          <input
            name="message"
            id="caption"
            type="text"
            maxLength={charLimit}
            onChange={handleChange}
            value={formData.message}
          ></input>
          <button type="submit" disabled={isPending || !user?.sub}>
            Post
          </button>
          <br />
        </form>
        {isPending && <p>Uploading post...</p>}
        {isError && <p>Something went wrong uploading post</p>}
      </div>
    )
  }
  return <p> log in to post</p>
}

export default UploadPage
