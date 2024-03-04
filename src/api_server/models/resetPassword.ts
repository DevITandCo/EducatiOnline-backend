import { model, Schema, Document } from 'mongoose'

export interface ResetPasswordDocument extends Document {
    email: string,
    token: string,
    valideUntil: Date
}

const resetPasswordSchema = new Schema<ResetPasswordDocument>(
  {
    email: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    valideUntil: {
      type: Date,
      require: true
    }
  },
  {
    timestamps: true
  }
)

export const ResetPasswordModel = model<ResetPasswordDocument>('ResetPassword', resetPasswordSchema)
