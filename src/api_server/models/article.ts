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
// Titre
// Pathologie (terme technique)
// Symptômes
// Comment contribuer au bien-être, sécuriser l'apprentissage de la réussite
// Liste des procédures pour se faire aider à la prise en charge
// Lien pour du contenu supplémentaire
// Déficiences liées
// Formulaire de contact



/**
 * TODO quand tu reviens de fumer/autre:
 * arranger le code backend en consequence du nouveau modele d'article
 * adapter les codes frontend pour le get article
 */

export const ArticleModel = model<ArticleDocument>('Article', articleSchema)
