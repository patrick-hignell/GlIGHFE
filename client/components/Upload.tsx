import { useState } from 'react'
import { PhotoUploader } from './PhotoUploader'

function UploadPage() {
  const [imageId, setImageId] = useState('kitten')

  function handleImageChange(newImage: string) {
    setImageId(newImage)
    console.log(newImage)
    console.log(imageId)
  }

  return <PhotoUploader image={imageId} onImageChange={handleImageChange} />
}

export default UploadPage
