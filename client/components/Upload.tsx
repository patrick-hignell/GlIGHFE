import { useState } from 'react'
import { PhotoUploader } from './PhotoUploader'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'
import Loading from './Loading'
import { PostData } from '../../models/post'
import { useAddPost } from '../hooks/usePosts'
import EmojiPicker, {
  EmojiStyle,
  Categories,
  EmojiClickData,
} from 'emoji-picker-react'

function UploadPage() {
  const [imageId, setImageId] = useState('')
  const charLimit = 30
  const [showPicker, setShowPicker] = useState(false)

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

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setFormData((previousData) => ({
      ...previousData,
      message: previousData.message + emojiObject.emoji,
    }))
  }

  // const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newLimit = Number(e.target.value)
  //   setCharLimit(newLimit)
  // }

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
      <div className="flex flex-col text-center">
        <PhotoUploader image={imageId} onImageChange={handleImageChange} />
        <br />
        <form onSubmit={handleSubmit}>
          {/* <label htmlFor="limit">Limit</label>
          <input
            name="limit"
            onChange={handleLimitChange}
            id="limit"
            type="number"
            max={20}
            value={charLimit}
          ></input> */}
          <br />
          {imageId && (
            <div className="flex-col gap-4">
              <div className="flex flex-row items-start justify-between">
                <label className="collapse" htmlFor="caption">
                  Caption
                </label>
                <div className="flex min-h-[520px] w-full flex-col">
                  <input
                    className="w-full rounded-lg p-2 text-4xl outline outline-gray-700"
                    name="message"
                    id="caption"
                    type="text"
                    maxLength={charLimit}
                    onChange={handleChange}
                    value={formData.message}
                    max={charLimit}
                  ></input>
                  {showPicker && (
                    <EmojiPicker
                      categories={[
                        { category: 'suggested' as Categories, name: '' },
                        { category: 'smileys_people' as Categories, name: '' },
                        { category: 'animals_nature' as Categories, name: '' },
                        { category: 'food_drink' as Categories, name: '' },
                        { category: 'travel_places' as Categories, name: '' },
                        { category: 'activities' as Categories, name: '' },
                        { category: 'objects' as Categories, name: '' },
                        { category: 'symbols' as Categories, name: '' },
                        { category: 'flags' as Categories, name: '' },
                      ]}
                      previewConfig={{
                        defaultEmoji: '1f60a',
                        defaultCaption: '',
                        showPreview: false,
                      }}
                      className=""
                      width="full"
                      onEmojiClick={onEmojiClick}
                      emojiStyle={EmojiStyle.NATIVE}
                      searchPlaceHolder=""
                    />
                  )}
                </div>
                <button
                  className="pl-4 text-5xl"
                  type="button"
                  onClick={() => setShowPicker((val) => !val)}
                >
                  😀
                </button>
                <button type="submit">
                  <i className="bi bi-send-fill pl-6 text-6xl text-gray-700"></i>
                </button>
              </div>
            </div>
          )}
          <br />
        </form>
        {isPending && <Loading />}
        {isError && <p>Something went wrong uploading post</p>}
      </div>
    )
  }
  return <p> log in to post</p>
}

export default UploadPage
