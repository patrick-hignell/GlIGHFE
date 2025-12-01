import { Image } from 'cloudinary-react'
import { addFile } from '../apis/upload'
import { ChangeEvent, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import Loading from './Loading'

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

  // const [file, setFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // if (e.target.files) setFile(e.target.files[0])
    if (e.target.files) mutate(e.target.files[0])
  }

  // function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   if (!file) return

  //   mutate(file)
  // }
  function handleImageClick() {
    fileInputRef.current?.click()
  }

  return (
    <div className="text-center">
      {isError && <p>Something went wrong!</p>}
      {isPending && <Loading />}
      {!isError && !isPending && (
        <button onClick={handleImageClick}>
          {image && (
            <Image
              cloudName="dfjgv0mp6"
              publicId={image}
              height="600"
              crop="limit"
            />
          )}
          {!image && (
            <i className="bi bi-file-image text-[15rem] transition-colors duration-200 hover:text-gray-600"></i>
          )}
        </button>
      )}
      <form>
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          onChange={(e) => handleChange(e)}
          ref={fileInputRef}
          style={{ display: 'none' }}
        ></input>
        {/* {!isPending && <button type="submit">Submit</button>} */}
      </form>
    </div>
  )
}
