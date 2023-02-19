import { Router } from "express";
import authRoutes from "./auth.js";
import boardRoutes from "./board.js";
import sectionRoutes from "./section.js";
import taskRoutes from "./task.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/boards", boardRoutes);
router.use("/boards/:boardId/sections", sectionRoutes);
router.use("/boards/:boardId/tasks", taskRoutes);

export default router;
