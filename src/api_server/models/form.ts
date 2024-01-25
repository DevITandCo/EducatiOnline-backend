import { model, Schema, Document } from 'mongoose'

export interface FormDocument extends Document {
  category: string
  author: string
  content: string
}

const formSchema = new Schema<FormDocument>(
  {
    category: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    content: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
)

export const FormModel = model<FormDocument>('Form', formSchema)
