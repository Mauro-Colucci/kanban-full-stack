import { Router } from "express";
import { checkObj, validate } from "../middleware/validation.js";
import { verifyToken } from "../middleware/tokenHandler.js";
import {
  createSection,
  deleteSection,
  updateSection,
} from "../controllers/section.js";

const router = Router({ mergeParams: true });

router.use(verifyToken);
router.use(validate);

router.route("/").post(checkObj("boardId"), createSection);

router
  .route("/:sectionId")
  .put(checkObj("boardId"), checkObj("sectionId"), updateSection)
  .delete(checkObj("boardId"), checkObj("sectionId"), deleteSection);

export default router;
