import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    );

    const user = await User.create({
      username,
      password: encryptedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select("password username");
    if (!user) {
      return res.status(401).json({
        errors: [{ param: "username", msg: "Invalid username or password" }],
      });
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      return res.status(401).json({
        errors: [{ param: "username", msg: "Invalid username or password" }],
      });
    }

    // const { password, ...others } = user._doc;
    user.password = undefined;

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};
