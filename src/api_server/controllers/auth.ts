import { Request, Response } from 'express'
import { setStatus } from '@/lib/utils'
import { UserModel } from '@/api_server/models/user'
import { pbkdf2Sync, randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'

interface tmpUser {
  id: string
  firstName: string
  lastName: string
  email: string
  rank: string
}

function createToken(user: tmpUser): string | jwt.JwtPayload {
  return jwt.sign(
    {
      id: user.id,
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email,
      rank: user.rank
    },
    String(process.env.SECRET_KEY),
    {
      expiresIn: '1h'
    }
  )
}

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body
    const rank = 0

    // Verificar si el usuario ya existe por su correo electrónico
    const existingUser = await UserModel.findOne({ email })
    if (existingUser != null) {
      res.status(409).json({ status: setStatus(req, 409, 'Conflict') })
      return
    }

    // Crear un nuevo usuario
    const salt = randomBytes(32).toString('hex')
    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex')

    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      salt,
      rank
    })

    res.status(201).json({
      data: {
        id: newUser.id,
        firstName, 
        lastName,
        email,
        rank
      },
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Buscar el usuario por el correo electrónico
    const user = await UserModel.findOne({ email })
    if (user == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // Crear un hash de la contraseña proporcionada durante el inicio de sesión
    const hashedPassword = pbkdf2Sync(
      password,
      user.salt,
      10000,
      64,
      'sha512'
    ).toString('hex')

    // Comparar el hash generado con el hash almacenado en la base de datos
    if (hashedPassword !== String(user.password)) {
      res.status(401).json({ status: setStatus(req, 401, 'Unathorized') })
      return
    }

    const token = createToken({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      rank: user.rank
    })

    res.status(200).json({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rank: user.rank,
        token
      },
      status: setStatus(req, 200, 'OK')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, firstName, lastName, email, password } = req.body

    const salt = randomBytes(32).toString('hex')
    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex')


    // Look user by mail
    const existingUser = await UserModel.findByIdAndUpdate({_id: id}, {
      id, 
      firstName, 
      lastName, 
      email, 
      hashedPassword
  })
  if (existingUser == null) {
    res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
    return
  }

    // Setting value in rank
    res.status(201).json({
      data: {
      id: existingUser.id,
      firstName: existingUser.firstName, 
      lastName: existingUser.lastName,
      email: existingUser.email,
      },
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}


export const updateUserRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, rank} = req.body

    // Look user by mail
    const existingUser = await UserModel.findByIdAndUpdate({_id: id}, {
      rank: rank
    })
    if (existingUser == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // Setting value in rank
    res.status(201).json({
      data: {
      id: existingUser.id,
      rank: rank
      },
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body

    const user = await UserModel.findByIdAndDelete({_id: id})
    if (user == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(201).json({
      data: {
      },
      status: setStatus(req, 201, 'OK CREATED')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { id } = req.body
    const id = req.url.split('?')[1].split('=')[1]

    const user = await UserModel.findById({_id: id}, 
      {
        password: 0,
        salt: 0
      })
    if (user == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(200).json({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rank: user.rank,
      },
      status: setStatus(req, 200, 'OK')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {

    const users = await UserModel.find({}, 
      {
          password: 0,
          salt: 0
      })
    if (users == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    res.status(200).json({
      data: {
        users
      },
      status: setStatus(req, 200, 'OK')
    })
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}
