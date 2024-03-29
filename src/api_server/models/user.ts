import { model, Schema, Document } from 'mongoose'

export interface UserDocument extends Document {
  firstName: string
  lastName: string
  email: string
  password: Buffer
  salt: Buffer
  rank: string
}

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: Buffer,
      required: true
    },
    salt: {
      type: Buffer,
      required: true
    },
    rank: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
)

export const UserModel = model<UserDocument>('User', userSchema)
