import mongoose from 'mongoose'
require('dotenv').config()

mongoose.set('strictQuery', true)
export const connectDB = async (): Promise<void> => {
  await mongoose
    .connect("mongodb+srv://admin:HPvzCfgcWT1K0XuA@cluster.ukkr5pz.mongodb.net/?retryWrites=true&w=majority")
    .catch((err) => console.error(err))
}
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
  console.error(`Mongoose error → ${String(err.message)}`)
})
