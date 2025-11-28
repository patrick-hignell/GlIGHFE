import { Router } from 'express'
import * as db from '../db/comments'

const router = Router()

// GET /api/v1/comments
router.get('/', async (req, res) => {
  try {
    const comments = await db.getAllComments()
    res.json({ comments })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/posts/:postid', async (req, res) => {
  try {
    const postId = Number(req.params.postid)
    const comments = await db.getCommentsByPostId(postId)
    res.json({ comments })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/users/:userid', async (req, res) => {
  try {
    const userId = Number(req.params.userid)
    const comments = await db.getCommentsByUserId(userId)
    res.json({ comments })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
