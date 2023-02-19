import { validationResult, param } from "express-validator";
import mongoose from "mongoose";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const checkObj = (str) =>
  param(str).custom((value) => {
    if (!isObjectId(value)) {
      return Promise.reject(`Invalid ${str.split("Id")[0]} ID`);
    } else return Promise.resolve();
  });
