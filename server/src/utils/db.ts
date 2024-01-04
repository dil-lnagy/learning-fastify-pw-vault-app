import mongoose from "mongoose";
import logger from "./logger";
import { DB_CONNECTION_STRING } from "../constants";

export async function connectToDb() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
  } catch (err) {
    logger.error(err, "Error connecting to database!");
    process.exit(1);
  }
}

export async function disconnectFromDb() {
  await mongoose.connection.close();
  logger.info("Disconnected from db.");
  return;
}
