import { Router } from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'
import { addUser, getUserById } from '../db/users.ts'
import { UserData } from '../../models/user.ts'
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

router.get('/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { authId, name, bio, font, profilePicture }: UserData = req.body
    await addUser({ authId, name, bio, font, profilePicture })
    res.sendStatus(201)
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
