import mongoose from "mongoose";
import { DB_CONNECTION_STRING } from "../constants";
import logger from "./logger";

export async function connectToDb() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("Connected to db");
  } catch (err) {
    logger.error(err, "error connecting to database");
    process.exit(1);
  }
}

export async function disconnectFromDb() {
  await mongoose.connection.close();

  logger.info("Disconnect from db");

  return;
}
