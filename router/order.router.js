import express from "express"
import { CapturePayment, createOrder } from "../controllers/order.controller.js"

const router = express.Router()


router.post("/create" , createOrder)
router.post("/capture" , CapturePayment)



export default router