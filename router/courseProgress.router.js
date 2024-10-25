import express from "express";
import { getCurrentCourseProgress, markCurrentLecturedViewed, resetCurrentCourseProgress } from "../controllers/courseProgress.controller.js";

const router = express.Router()

router.get("/get/:userId/:courseId" , getCurrentCourseProgress)
router.post("/mark-lecture-viewed" , markCurrentLecturedViewed)
router.post("/reset-progress" , resetCurrentCourseProgress)


export default router