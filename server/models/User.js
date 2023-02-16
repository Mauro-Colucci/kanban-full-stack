import mongoose from "mongoose";
import { schemaOptions } from "./modelsOptions.js";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
  },
  schemaOptions
);

const User = mongoose.model("User", UserSchema);

export default User;
