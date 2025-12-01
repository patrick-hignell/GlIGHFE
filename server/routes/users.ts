import { Router } from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'
import { StatusCodes } from 'http-status-codes'
import {
  addUser,
  getUserProfile,
  getUserPosts,
  getFollowers,
  getFollowing,
  editUser,
  editUserProfilePicture,
} from '../db/users.js'
import { UserData } from '../../models/user.js'

const router = Router()

// router.get('/', async (req, res) => {
//   try {
//     const fruits = await db.getAllFruits()

//     res.json({ fruits: fruits.map((fruit) => fruit.name) })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Something went wrong' })
//   }
// })

// GET /api/v1/users/:id - Get user profile by AuthId
router.get('/:id', async (req, res, next) => {
  try {
    const authId = req.params.id
    const user = await getUserProfile(authId)
    if (user) {
      res.json(user)
    } else {
      res.status(StatusCodes.NOT_FOUND).send('User not found')
    }
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const user = req.body
    const result = await editUser(user)
    if (result) {
      res.json(result)
    } else {
      res.status(StatusCodes.NOT_FOUND).send('User not found')
    }
  } catch (err) {
    next(err)
  }
})

router.patch('/', async (req, res, next) => {
  try {
    const { authId, profilePicture } = req.body
    const result = await editUserProfilePicture(authId, profilePicture)
    if (result) {
      res.json(result)
    } else {
      res.status(StatusCodes.NOT_FOUND).send('User not found')
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/v1/users - Add a new user
router.post('/', async (req, res, next) => {
  try {
    const { authId, name, bio, font, profilePicture }: UserData = req.body
    await addUser({ authId, name, bio, font, profilePicture })
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})

// GET /api/v1/users/:id/posts - Get all posts by a user
router.get('/:id/posts', async (req, res, next) => {
  try {
    const authId = req.params.id // <-- Use authId directly
    const posts = await getUserPosts(authId) // <-- Pass authId
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

// GET /api/v1/users/:id/followers - Get users following a user
router.get('/:id/followers', async (req, res, next) => {
  try {
    const authId = req.params.id // <-- Use authId directly
    const followers = await getFollowers(authId) // <-- Pass authId
    res.json(followers)
  } catch (err) {
    next(err)
  }
})

// GET /api/v1/users/:id/following - Get users a user is following
router.get('/:id/following', async (req, res, next) => {
  try {
    const authId = req.params.id // <-- Use authId directly
    const following = await getFollowing(authId) // <-- Pass authId
    res.json(following)
  } catch (err) {
    next(err)
  }
})

// router.put('/:id', async (req, res) => {
//   console.log(req.body)
//   try {
//     const id = Number(req.params.id)
//     await updateUserById(id, req.body)
//     res.sendStatus(204)
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).send('')
//     } else {
//       res.status(500)
//     }
//   }
// })

export default router
