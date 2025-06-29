import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("data base is connected");
  } catch (error) {
    console.log(error);
  }
};
