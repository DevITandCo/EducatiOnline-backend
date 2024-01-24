import { model, Schema, Document } from 'mongoose'

export interface ArticleDocument extends Document {
  title: string
  description: string
  content: string
}

const articleSchema = new Schema<ArticleDocument>(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    description: {
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

export const ArticleModel = model<ArticleDocument>('Article', articleSchema)
