import mongoose from 'mongoose';
require('dotenv').config();

mongoose.set('strictQuery', true);

export const connectDB = async (): Promise<void> => {
  await mongoose
    .connect(process.env.MONGODB_URI + '')
    .catch((err) => console.error(err));
};

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`Mongoose error → ${String(err.message)}`);
});
