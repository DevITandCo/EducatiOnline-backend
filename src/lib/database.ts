import mongoose from 'mongoose';

// URI OF THE MONGOGB (IN THIS CASE MongoDB Atlas)
const MongoURI = "mongodb+srv://admin:HPvzCfgcWT1K0XuA@cluster.ukkr5pz.mongodb.net/?retryWrites=true&w=majority";

mongoose.set('strictQuery', true);

export const connectDB = async (): Promise<void> => {
  await mongoose
    .connect(MongoURI)
    .catch((err) => console.error(err));
}

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`Mongoose error → ${String(err.message)}`);
});
