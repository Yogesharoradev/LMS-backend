import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
    title : String ,
    videoUrl : String ,
    public_id : String ,
    freePreview : Boolean
})



const CourseSchema = new mongoose.Schema({
    instructorId : String ,
    instructorName : String ,
    date : Date , 
    title : String ,
    category : String ,
    level : String ,
    primaryLanguage :String , 
    subtitle : String ,
    description : String, 
    image : String ,
    welcomeMessage : String,
    pricing : Number,
    objectives : String ,
    Students :[
        {
            studentId  :String , 
            studentName :String,
            studentEmail :String,
            paidAmount : String
        }
    ],
    curriculum : [LectureSchema],
    ispublished : Boolean

})

const Course = mongoose.model("Courses" , CourseSchema)


export default Course