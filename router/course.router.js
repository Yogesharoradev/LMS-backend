import express from "express"
import { addNewCourse, getAllCourses, getCourseDetailsById, UpdateCourseById, DeleteCourseById } from "../controllers/course.controller.js"

const router = express.Router()

router.post("/add" , addNewCourse)
router.get("/get" , getAllCourses)
router.get("/get/details/:id" , getCourseDetailsById)
router.put("/update/:id", UpdateCourseById)
router.delete("/delete/:id", DeleteCourseById)




export default router