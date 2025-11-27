import { Image } from 'cloudinary-react'
import { addFile } from '../apis/upload'
import { ChangeEvent, MouseEvent, useState } from 'react'

interface Props {
  image: string
  onImageChange: (newImage: string) => void
}

export function PhotoUploader({ image, onImageChange }: Props) {
  const [file, setFile] = useState<File>()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFile(e.target.files[0])
  }

  async function handleSubmit(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) {
    e.preventDefault()
    if (!file) return

    const response = await addFile(file)
    onImageChange(response.publicId)
  }

  return (
    <div>
      <p>Meow!</p>
      <Image cloudName="dfjgv0mp6" publicId={image} width="300" crop="scale" />
      <form>
        <input
          type="file"
          accept=".jpg, .png .webp"
          onChange={(e) => handleChange(e)}
        ></input>
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Submit
        </button>
      </form>
    </div>
  )
}
