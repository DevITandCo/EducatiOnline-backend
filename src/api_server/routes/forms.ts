import express from 'express'
import * as formCtrl from '@/api_server/controllers/forms'
import { validateBody } from '@/api_server/middlewares/parser'

// ----- user input validation ---------------
import { object, string } from 'yup'

export const form = object().shape({
  category: string(),
  author: string(),
  content: string()
})
// -------------------------------------------

const router = express.Router()

router.post('/create', validateBody(form), formCtrl.createForm)
router.post('/update', validateBody(form), formCtrl.updateForm)
router.post('/delete', validateBody(form), formCtrl.deleteForm)
router.get('/get', validateBody(form), formCtrl.getForm)
router.get('/getAll', validateBody(form), formCtrl.getForms)

export default router
