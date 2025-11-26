import { Image } from 'cloudinary-react'
import { addFile } from '../apis/upload'
import { ChangeEvent, useState } from 'react'

// cloudinary.config({
//   cloud_name: 'dfjgv0mp6',
//   secure: true,
// })

// const url = cloudinary.url('kitten', {
//   transformation: [
//     {
//       fetch_format: 'auto',
//       quality: 'auto',
//     },
//   ],
// })

function UploadPage() {
  const [file, setFile] = useState<File>()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFile(e.target.files[0])
  }

  async function handleSubmit() {
    if (!file) return

    const postId = await addFile(file)
    console.log(postId)
    // use POST route to add to server using api
  }

  return (
    <div>
      <p>Meow!</p>
      <Image cloudName="dfjgv0mp6" publicId="kitten" width="300" crop="scale" />
      <form>
        <input
          type="file"
          accept=".jpg, .png .webp"
          onChange={(e) => handleChange(e)}
        ></input>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  )
}

export default UploadPage
