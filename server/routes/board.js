import { Router } from "express";
import { checkObj, validate } from "../middleware/validation.js";
import { verifyToken } from "../middleware/tokenHandler.js";
import {
  create,
  deleteBoard,
  getAll,
  getFavorites,
  getOne,
  update,
  updateFavoritePosition,
  updatePosition,
} from "../controllers/board.js";

const router = Router();

router.use(verifyToken);
router.route("/").post(create).get(getAll).put(updatePosition);

router.route("/favorites").get(getFavorites).put(updateFavoritePosition);

router.use(validate);
router
  .route("/:boardId")
  .get(checkObj("boardId"), getOne)
  .put(checkObj("boardId"), update)
  .delete(checkObj("boardId"), deleteBoard);

export default router;
