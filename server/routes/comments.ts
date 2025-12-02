import { Router } from 'express'
import * as db from '../db/comments'
import { Comment } from '../../models/comment'

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
    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/users/:userid', async (req, res) => {
  try {
    const userId = req.params.userid
    const comments = await db.getCommentsByUserId(userId)
    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

//POST /api/v1/comments

// POST /api/v1/comments/userid

router.post('/', async (req, res) => {
  try {
    const commentData = req.body
    await db.addComment(commentData)
    res.sendStatus(201)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      res.status(500).json({
        message: 'Something went wrong posting comment',
        error: error.message,
      })
    } else {
      res.status(500).json({ message: 'Something went wrong posting comment' })
    }
  }
})

// PATCH /api/v1/comments/id

router.patch('/:id', async (req, res) => {
  try {
    const commentData = req.body
    const commentId = Number(req.params.id)
    await db.updateComment(commentId, commentData)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong updating comment' })
  }
})

// DELETE /api/v1/comments

router.delete('/', async (req, res) => {
  try {
    const comment: Comment = req.body
    const deletedComment = await db.deleteComment(comment)
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    res.json(deletedComment)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message)
    } else {
      console.error('something went wrong')
    }
    res.status(500).json({ message: 'Something went wrong deleting comment' })
  }
})

export default router
