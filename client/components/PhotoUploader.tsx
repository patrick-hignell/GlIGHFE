import { Image } from 'cloudinary-react'
import { addFile } from '../apis/upload'
import { ChangeEvent, MouseEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

interface Props {
  image: string
  onImageChange: (newImage: string) => void
}

export function PhotoUploader({ image, onImageChange }: Props) {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: addFile,
    onSuccess: (data) => {
      onImageChange(data.publicId)
    },
  })

  const [file, setFile] = useState<File>()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFile(e.target.files[0])
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) return

    mutate(file)
  }

  return (
    <div>
      {isError && <p>Something went wrong!</p>}
      {isPending && <p>Loading...</p>}
      {!isError && (
        <Image
          cloudName="dfjgv0mp6"
          publicId={image}
          width="300"
          crop="scale"
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          onChange={(e) => handleChange(e)}
        ></input>
        {!isPending && <button type="submit">Submit</button>}
      </form>
    </div>
  )
}
