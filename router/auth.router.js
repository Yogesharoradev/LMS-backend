import express from "express"
import { LoginUser, LogoutUser, RegisterUser } from "../controllers/auth.controller.js"
import { Authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register" , RegisterUser )

router.post("/login" , LoginUser )

router.get("/check" , Authenticate , (req, res)=>{

    const user = req.user

    return res.status(200).json({
        success :true , 
        message : "User Authenticated",
        data: {
            user
        }
    })
})

router.get("/logout" , LogoutUser)

export default router