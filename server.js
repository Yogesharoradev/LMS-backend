import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import AuthRouter from "./router/auth.router.js"
import MediaRouter from "./router/admin.router.js"
import adminCourseRouter from "./router/course.router.js"
import studentViewRouter from "./router/studentView.router.js"
import OrderRouter from "./router/order.router.js"
import studentProgressRouter from "./router/courseProgress.router.js"


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI


app.use(cors({
    origin : [process.env.CLIENT_URL , process.env.PRODUCTION_CLIENT_URL],
    methods : ["PUT", "DELETE" , "POST", "GET"],
    allowedHeaders : ["Content-Type" , "Authorization"],
    credentials : true
}));

app.use(express.json())
app.use(cookieParser())


//db connect 

mongoose.connect(MONGO_URI)
.then(()=> console.log("mongodb is connected"))
.catch((e)=>console.log(e))

//routes congfiguration

app.use("/auth" , AuthRouter)
app.use("/media" , MediaRouter)
app.use("/instructor/course" , adminCourseRouter)
app.use("/student" , studentViewRouter)
app.use("/order" , OrderRouter)
app.use("/student/course-progress" , studentProgressRouter)




app.use((err,req, res , next)=>{
    console.log(err.stack)
    res.status(500).json({
        success : false,
        message : "something went wrong"
    })
})

app.listen(PORT , ()=>{
    console.log(`server is running on ${PORT}`)
})