import express from "express"
import { getStudentCourseData, getStudentCourseDetailsById } from "../controllers/student.controller.js"
import { getCoursesById } from "../controllers/student-courses.controller.js"

const router = express.Router()

router.get("/get" , getStudentCourseData)
router.get("/get/course/:id/:studentId" , getStudentCourseDetailsById)

router.get("/getBoughtCourse/:studentId" , getCoursesById)


export default router