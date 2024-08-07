import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // const connect = await mongoose.connect('mongodb://localhost:27017/expense-graphql-app');
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log('mongodb connected successfully');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
