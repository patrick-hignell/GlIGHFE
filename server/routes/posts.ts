import { Router } from 'express'
import * as db from '../db/posts'

const router = Router()

// GET /api/v1/posts
router.get('/', async (req, res) => {
  try {
    const posts = await db.getAllPosts()
    res.json({ posts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
