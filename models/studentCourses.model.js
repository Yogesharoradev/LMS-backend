import mongoose from "mongoose"

const StudentCoursesModelSchema = new mongoose.Schema({
    userId: String , 
    courses : [
        {
            courseId: String,
            title :String ,
            instructorId : String,
            instructorName : String,
            dateOfPurchase : String,
            courseImage : String,

        }
    ]
})

const StudentCourses = mongoose.model("studentCourses" , StudentCoursesModelSchema)

export default StudentCourses