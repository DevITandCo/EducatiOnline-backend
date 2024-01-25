import { Request, Response } from 'express'
import { setStatus } from '@/lib/utils'
import { FormModel } from '@/api_server/models/form'

export const createForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, author, content } = req.body

    const newForm = await FormModel.create({
      category,
      author,
      content
    })

    res.status(201).json({
      data: {
        id: newForm.id,
        category,
        author,
        content
      },
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const updateForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, category, author, content } = req.body
    
    const newForm = await FormModel.findByIdAndUpdate(id, {
      id,
      category,
      author,
      content
    }, {new: true})
    if (newForm == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(201).json({
      data: {
        id: newForm.id,
        category: newForm.category,
        author: newForm.author,
        content: newForm.content
      },
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const deleteForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body

    const existingForm = await FormModel.findOneAndDelete({ id })
    if (existingForm == null) {
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


export const getForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body

    const existingForm = await FormModel.findOne({ id })
    if (existingForm == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(201).json({
      data: {
        id: id,
        category: existingForm.category,
        author: existingForm.author,
        content: existingForm.content
      },
      status: setStatus(req, 200, 'OK')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const getForms = async (req: Request, res: Response): Promise<void> => {
  try {

    const existingForm = await FormModel.find({})
    if (existingForm == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(201).json({
      data: {
        existingForm
      },
      status: setStatus(req, 200, 'OK')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

