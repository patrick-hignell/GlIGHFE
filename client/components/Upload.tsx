import { useState } from 'react'
import { PhotoUploader } from './PhotoUploader'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation } from '@tanstack/react-query'
import { addPost } from '../apis/posts'
import { useNavigate } from 'react-router'

function UploadPage() {
  const [imageId, setImageId] = useState('kitten')
  const [charLimit, setCharLimit] = useState(10)

  const { user, isAuthenticated } = useAuth0()
  const [formData, setFormData] = useState({
    userId: user?.sub,
    message: '',
    imageUrl: imageId,
    charLimit: charLimit,
    font: '',
    public: true,
  })
  const navigate = useNavigate()
  const { mutate, isPending, isError } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      navigate('/feed')
    },
  })

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
    const submissionData = {
      ...formData,
      imageUrl: imageId,
      charLimit: charLimit,
    }
    mutate(submissionData)
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
          <button type="submit">Post</button>
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
