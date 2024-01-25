import { Request, Response } from 'express'
import { setStatus } from '@/lib/utils'
import { ArticleModel } from '@/api_server/models/article'

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, content } = req.body

    const newArticle = await ArticleModel.create({
      title,
      description,
      content
    })

    res.status(201).json({
      data: {
        newArticle
      },
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, title, description, content } = req.body

    const newArticle = await ArticleModel.findByIdAndUpdate({_id: id}, {
      id,
      title,
      description,
      content
    }, {new: true})
    if (newArticle == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(201).json({
      data: {
        newArticle
      },
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body

    const existingArticle = await ArticleModel.findByIdAndDelete({_id: id})
    if (existingArticle == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(201).json({
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}


export const getArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body

    // console.log(id)
    const existingArticle = await ArticleModel.findById({_id: id})
    if (existingArticle == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(200).json({
      data: {
        existingArticle
      },
      status: setStatus(req, 200, 'OK')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {

    const existingArticle = await ArticleModel.find({}, 'id title')
    if (existingArticle == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(200).json({
      data: {
        existingArticle
      },
      status: setStatus(req, 200, 'OK')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

