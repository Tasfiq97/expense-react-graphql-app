import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log('mongodb connected successfully');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
