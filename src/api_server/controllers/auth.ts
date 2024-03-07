import { Request, Response } from 'express'
import { setStatus } from '@/lib/utils'
import { UserModel } from '@/api_server/models/user'
import { ResetPasswordModel } from '@/api_server/models/resetPassword'
import { pbkdf2Sync, randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'

const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config()

const generateForgotPasswordToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_PROXY,
  port: 8000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

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

    // look in db if new email is already existing
    const existingUser = await UserModel.findOne({ email })
    if (existingUser != null) {
      res.status(409).json({ status: setStatus(req, 409, 'Conflict') })
      return
    }

    // make an hashed password with password and user salt
    const salt = randomBytes(32).toString('hex')
    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex')
    
    // insert new user in db
    const newUser = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      salt: salt,
      rank: "0"
    })
    
    console.log(newUser)

    // reply with json containing http code only
    res.status(201).json({
      data: {},
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

    // look in db if user exist 
    const user = await UserModel.findOne({ email })
    if (user == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // make a hashed password with password and user salt
    const hashedPassword = pbkdf2Sync(
      password,
      user.salt,
      10000,
      64,
      'sha512'
    ).toString('hex')

    // compare hashed passowrd and user hashed password
    if (hashedPassword !== String(user.password)) {
      res.status(401).json({ status: setStatus(req, 401, 'Unathorized') })
      return
    }

    // create jwt object
    const token = createToken({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      rank: user.rank
    })

    // reply with json containing jwt
    res.status(200).json({
      jwt: token,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rank: user.rank
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
    const { id, firstName, lastName, email, password, new_password } = req.body

    // look in db if user exists
    const existingUser = await UserModel.findById({_id: id})
    if (existingUser == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // look in db if new email is already existing
    const oexistingUser = await UserModel.findOne({ email })
    if (oexistingUser != null) {
      res.status(409).json({ status: setStatus(req, 409, 'Conflict') })
      return
    }

    // make an hashed password with password and user salt
    const hashedPassword = pbkdf2Sync(
      password,
      existingUser.salt,
      10000,
      64,
      'sha512'
    ).toString('hex')

    // compare hashed password and user hashed password
    if (hashedPassword !== String(existingUser.password)) {
      res.status(401).json({ status: setStatus(req, 401, 'Unathorized') })
      return
    }

    const newFirstName = firstName == '' ? existingUser.firstName : firstName
    const newLastName = lastName == '' ? existingUser.lastName : lastName
    const newEmail = email == '' ? existingUser.email : email

    // create a new hashed passowrd with new password and a new salt
    const salt = randomBytes(32).toString('hex')
    const newHashedPassword = pbkdf2Sync(
      new_password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex')

    // update user in db
    const newUser = await UserModel.findByIdAndUpdate({_id: id}, {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      password: newHashedPassword,
      salt: salt,
      rank: "0"
    })
    if (newUser == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // create jwt object
    const token = createToken({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      rank: newUser.rank
    })    

    // reply with json containing user infos
    res.status(201).json({
      jwt: token,
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        rank: newUser.rank
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

    // look in db if user exists, if so delete it in db
    const user = await UserModel.findByIdAndDelete({_id: id})
    if (user == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // reply with http code only
    res.status(201).json({
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
    // store id from url
    const id = req.url.split('?')[1].split('=')[1]

    // look in db if user exists
    const user = await UserModel.findById({_id: id}, 
      {
        password: 0,
        salt: 0
      })
    if (user == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // reply with json containing user infos
    res.status(200).json({
      data: {
        user
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

    // look in db for all users
    const users = await UserModel.find({}, 
      {
          password: 0,
          salt: 0
      })
    if (users == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // reply with json containing list of all users
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

export const sendPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // look in db if user exists
    const existingUser = await UserModel.find({email: email}, 
      {
        password: 0,
        salt: 0
      })
    if (existingUser == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    const token = generateForgotPasswordToken();
    console.log('Random Token:', token);

    const valideUntilDate = new Date(Date.now() + 2 * (60 * 60 * 1000) )

    // insert new reset password request in db
    await ResetPasswordModel.create({
      email: email,
      token: token,
      valideUntil: valideUntilDate
    })

    // format mail text to html
    const url = 'https://educonline-frontend-vkhphrdymq-uc.a.run.app'
    const formattedText = ''
    + 'Cher utilisateur,'
    + '<br>'
    + '<br>'
    + 'Vous recevez cet e-mail parce que vous avez demandé la réinitialisation du mot de passe de votre compte.'
    + '<br>'
    + 'Si vous n\'avez pas demandé la réinitialisation de votre mot de passe, veuillez ignorer cet e-mail. Votre compte restera sécurisé.'
    + '<br>'
    + '<br>'
    + 'Pour réinitialiser votre mot de passe et retrouver l\'accès à votre compte, veuillez cliquer sur le lien ci-dessous :'
    + '<br>'
    + '<a href=' + url + '/reset-password?token=' + token + '>'
    + url + '/reset-password?token=' + token
    + '</a>'
    + '<br>'
    + '<br>'
    + '-- L\'équipe EducOnline --'
    + '<br>'
    + 'Note: Ce lien de réinitialisation du mot de passe est valable pendant 2 heures.' 
    + 'Si vous rencontrez des problèmes ou si vous avez besoin d\'une assistance supplémentaire, veuillez contacter notre équipe d\'assistance à l\'adresse ci-dessous :' 
    + '<br>'
    + '<a href="mailto:contact.educonline@gmail.com">contact.educonline@gmail.com</a>'

    // prepare mail
    const mailOptions = {
      from: 'contact.educonline@gmail.com',
      to: email,
      subject: 'Password Reset',
      html: formattedText
    };

    // send mail object
    transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending password reset email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(201).json({
          status: setStatus(req, 201, 'OK CREATED')
        })
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: setStatus(req, 500, 'Internal Server Error') })
  }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // store id from request body
    const {token, new_password} = req.body

    // look in db if reset password request exists
    const request = await ResetPasswordModel.findOne({token: token}, {})
    if (request == null) {
      res.status(404).json({ status: setStatus(req, 404, 'Not Found') })
      return
    }

    // check time passed between token generation and token use
    const timePassed = new Date().getTime() - request.valideUntil.getTime()
    const timeLimit = 2 * (60 * 60 * 1000)
    if (timePassed > timeLimit) {
      res.status(401).json({ status: setStatus(req, 401, 'Unauthorized') })
      return
    }

    // create a new hashed passowrd with new password and a new salt
    const salt = randomBytes(32).toString('hex')
    const newHashedPassword = pbkdf2Sync(
      new_password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex')

    // update user password in db
    await UserModel.findOneAndUpdate({email: request.email}, {
      password: newHashedPassword,
      salt: salt
    })

    // delete token in db
    await ResetPasswordModel.findOneAndDelete({token: token}, {})
    if (request == null) {
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