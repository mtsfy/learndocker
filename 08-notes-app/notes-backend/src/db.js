const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/${process.env.NOTES_DB}`, {
      auth: {
        username: process.env.NOTES_USER,
        password: process.env.NOTES_PASSWORD,
      },
      connectTimeoutMS: 500,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
