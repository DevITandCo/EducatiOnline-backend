import { Request, Response } from 'express'
import { setStatus } from '@/lib/utils'
import { ArticleModel } from '@/api_server/models/article'

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title,
      pathology,
      symptoms,
      contributions,
      procedures,
      additional,
      related } = req.body

    const newArticle = await ArticleModel.create({
      title,
      pathology,
      symptoms,
      contributions,
      procedures,
      additional,
      related 
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
    const { 
      id,
      title,
      pathology,
      symptoms,
      contributions,
      procedures,
      additional,
      related } = req.body
    
    const existingArticle = await ArticleModel.findByIdAndUpdate({_id: id}, {
      id,
      title,
      pathology,
      symptoms,
      contributions,
      procedures,
      additional,
      related
    }, {new: true})
    if (existingArticle == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(201).json({
      data: {
        existingArticle
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
    const id = req.url.split('?')[1].split('=')[1]
    
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

    const existingArticles = await ArticleModel.find({}, 'id title')
    if (existingArticles == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(200).json({
      data: {
        articles: existingArticles
      },
      status: setStatus(req, 200, 'OK')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

