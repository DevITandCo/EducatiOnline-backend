import { model, Schema, Document } from 'mongoose'

export interface UserDocument extends Document {
  username: string
  email: string
  password: Buffer
  salt: Buffer
  rank: string
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: Buffer,
      require: true
    },
    salt: {
      type: Buffer,
      require: true
    },
    rank: {
      type: String,
      require: true
    },
  },
  {
    timestamps: true
  }
)

export const UserModel = model<UserDocument>('User', userSchema)
