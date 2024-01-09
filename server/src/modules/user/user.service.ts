import crypto from "crypto";

//generate salt
export function generateSalt() {
  return crypto.randomBytes(64).toString("hex");
}

import { UserModel } from "./user.model";

//create a user
export async function createUser(input: {
  hashedPassword: string;
  email: string;
}) {
  return UserModel.create({
    email: input.email,
    password: input.hashedPassword,
  });
}
