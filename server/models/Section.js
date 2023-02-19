import mongoose from "mongoose";
import { schemaOptions } from "./modelsOptions.js";

const SectionSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  schemaOptions
);

const Section = mongoose.model("Section", SectionSchema);

export default Section;
