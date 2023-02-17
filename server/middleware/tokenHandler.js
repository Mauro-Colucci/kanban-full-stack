import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const tokenDecode = (req) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ")[1];
    try {
      const tokenDecoded = jwt.verify(bearer, process.env.TOKEN_SECRET_KEY);
      return tokenDecoded;
    } catch {
      return false;
    }
  } else {
    return false;
  }
};

export const verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    const user = await User.findById(tokenDecoded.id);
    if (!user) return res.status(401).json("Unauthorized");
    req.user = user;
    next();
  } else {
    res.status(401).json("Unauthorized");
  }
};

/* const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = await User.findById(decoded.id);
    next();
  });
};

export default verifyToken;
 */
