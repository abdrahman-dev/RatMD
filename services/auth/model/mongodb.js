import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URL)
        logger.info("Connected to MongoDB")
    }
    catch (error) {
        logger.error("Error connecting to MongoDB", error)
    }
}

export default connectDB;