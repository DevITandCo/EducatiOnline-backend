import express from 'express'
import * as articleCtrl from '@/api_server/controllers/articles'
import { validateBody } from '@/api_server/middlewares/parser'

// ----- user input validation ---------------
import { object, string } from 'yup'

export const article = object().shape({
  title: string(),
  description: string(),
  content: string()
})
// -------------------------------------------

const router = express.Router()

router.post('/create', validateBody(article), articleCtrl.createArticle)
router.post('/update', validateBody(article), articleCtrl.updateArticle)
router.post('/delete', validateBody(article), articleCtrl.deleteArticle)
router.get('/get', validateBody(article), articleCtrl.getArticle)
router.get('/getAll', validateBody(article), articleCtrl.getArticles)

export default router
