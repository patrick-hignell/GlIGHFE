import { Router } from 'express'
// import db from '../db/connection'
import checkJwt, { JwtRequest } from '../auth0.ts'
import { StatusCodes } from 'http-status-codes'
import {
  addUser,
  getUserProfile,
  getUserPosts,
  getFollowers,
  getFollowing,
  editUser,
  editUserProfilePicture,
  addFollow,
  removeFollow,
  editUserProfile,
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

router.patch('/profile', async (req, res, next) => {
  try {
    const { user } = req.body
    const result = await editUserProfile(user)
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
router.post('/', async (req, res) => {
  try {
    const userData: UserData = { ...req.body }
    if (!userData.authId) {
      return res.status(StatusCodes.BAD_REQUEST).send('AuthID is required')
    }

    if (!userData.name) {
      userData.name = 'New User' // Provide a default name
    }

    const existingUser = await getUserProfile(userData.authId)
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).send('User already exists')
    }

    await addUser(userData)
    res.sendStatus(StatusCodes.CREATED)
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
    } else {
      console.error(err)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send('An unknown error occurred')
    }
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

// POST /api/v1/users/:id/follow - Add a follower
router.post('/:id/follow', checkJwt, async (req: JwtRequest, res, next) => {
  try {
    const followingId = req.params.id
    const followerId = req.auth?.sub

    if (!followerId) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized')
    }

    // Prevent a user from following themselves
    if (followerId === followingId) {
      return res.status(StatusCodes.BAD_REQUEST).send('Cannot follow yourself')
    }

    const result = await addFollow(followerId, followingId)
    // Knex insert for SQLite returns an array with the rowid of the inserted row
    if (result && result.length > 0) {
      res.sendStatus(StatusCodes.CREATED)
    } else {
      res.status(StatusCodes.CONFLICT).send('Already following this user')
    }
  } catch (err) {
    // Check if it's a unique constraint violation (SQLite or PostgreSQL)
    if (
      err instanceof Error &&
      (err.message.includes('UNIQUE constraint failed') ||
        err.message.includes('duplicate key value'))
    ) {
      return res
        .status(StatusCodes.CONFLICT)
        .send('Already following this user')
    }
    next(err)
  }
})

// DELETE /api/v1/users/:id/follow - Remove a follower
router.delete('/:id/follow', checkJwt, async (req: JwtRequest, res, next) => {
  try {
    const followingId = req.params.id
    const followerId = req.auth?.sub

    if (!followerId) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized')
    }

    const result = await removeFollow(followerId, followingId)
    // Knex delete returns the number of affected rows
    if (result > 0) {
      res.sendStatus(StatusCodes.OK)
    } else {
      res.status(StatusCodes.NOT_FOUND).send('Follow relationship not found')
    }
  } catch (err) {
    next(err)
  }
})

export default router
