// import { v2 as cloudinary } from 'cloudinary'
// import dotenv from 'dotenv'
import request from 'superagent'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function addFile(file: File): Promise<number> {
  const data = new FormData()
  data.append('my_file', file)
  // const response = await request.post(`${rootURL}/upload`).attach('image', data)
  const response = await request
    .post(`${rootURL}/upload`)
    .attach('image', file as any | Blob)
  console.log(response.body)
  return response.body
}
