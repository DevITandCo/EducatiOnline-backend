import { model, Schema, Document } from 'mongoose'

export interface ArticleDocument extends Document {
  title: string
  pathology: string
  symptoms: string
  contributions: string
  procedures: string
  additional: string
  related: string
}

const articleSchema = new Schema<ArticleDocument>(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    pathology: {
      type: String,
      required: true
    },
    symptoms: {
      type: String,
      required: true
    },
    contributions: {
      type: String,
      required: true
    },
    procedures: {
      type: String,
      required: true
    },
    additional: {
      type: String,
      required: true
    },
    related: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const ArticleModel = model<ArticleDocument>('Article', articleSchema)
