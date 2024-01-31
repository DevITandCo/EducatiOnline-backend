import express from 'express'
import * as authCtrl from '@/api_server/controllers/auth'
import { validateBody } from '@/api_server/middlewares/parser'

// ----- user input validation ---------------
import { object, string } from 'yup'

export const user = object().shape({
  firstName: string().transform((firstName: string) => firstName.toLowerCase()),
  lastName: string().transform((lastName: string) => lastName.toUpperCase()),
  email: string()
    .email()
    .transform((email: string) => email.toLowerCase()),
  rank: string(),
  password: string().min(8)
})
// -------------------------------------------

const router = express.Router()

router.post('/sign-up', validateBody(user), authCtrl.signUp)
router.post('/sign-in', validateBody(user), authCtrl.signIn)
router.post('/update', validateBody(user), authCtrl.updateUser)
router.post('/setRank', validateBody(user), authCtrl.updateUserRank)
router.post('/delete', validateBody(user), authCtrl.deleteUser)
router.get('/getAll', validateBody(user), authCtrl.getAllUsers)
router.get('/get', validateBody(user), authCtrl.getUser)

export default router
