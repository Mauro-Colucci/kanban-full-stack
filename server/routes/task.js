import { Router } from "express";
import { checkObj, validate } from "../middleware/validation.js";
import { verifyToken } from "../middleware/tokenHandler.js";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskPosition,
} from "../controllers/task.js";

const router = Router({ mergeParams: true });

router.use(verifyToken);
router.use(validate);

router.route("/").post(checkObj("boardId"), checkObj("sectionId"), createTask);

router.route("/update-position").put(checkObj("boardId"), updateTaskPosition);

router
  .route("/:taskId")
  .put(checkObj("boardId"), checkObj("taskId"), updateTask)
  .delete(checkObj("boardId"), checkObj("taskId"), deleteTask);

export default router;
