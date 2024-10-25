import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lectureId : String ,
    viewed : Boolean,
    dateViewed : Date
})

const CourseProgressScehma = new mongoose.Schema({
    userId : String,
    courseId : String,
    completed : {
        type :Boolean,
        default : false
    },
    completionDate : {
       type : Date,
        default : null
    } ,
    lectureProgress : [lectureProgressSchema],
})

const CourseProgress = new mongoose.model("courseProgress" , CourseProgressScehma)


export default CourseProgress