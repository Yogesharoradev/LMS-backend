import Course from "../models/course.model.js"
import CourseProgress from "../models/courseProgress.model.js"
import StudentCourses from "../models/studentCourses.model.js"


export const getCurrentCourseProgress =async (req,res)=>{
    try{

        const {userId , courseId} = req.params

        const studentPurchaseCourses = await StudentCourses.findOne({userId})

        const isCurrentCoursePurchased = studentPurchaseCourses?.courses?.findIndex(item => item.courseId === courseId) > -1

        if(!isCurrentCoursePurchased){
            return  res.status(200).json({success : true , isPurchased : false ,  message : "You need to purchase this course to acesss it"})
        }

        const currentUserCourseProgress = await CourseProgress.findOne({userId , courseId})

        if(!currentUserCourseProgress ||  currentUserCourseProgress?.lectureProgress?.length === 0 ){
            const course = await Course.findById(courseId)
            if(!course){
                return  res.status(500).json({success : false , message : "course not foud"})
        }
        return  res.status(200).json({
            success : true ,
             message : "no progress found , start watching the course",
             data : {
                courseDetails : course,
                progress  : [],
                isPurchased : true
             } 
        })
       }

      const courseDetails = await Course.findById(courseId) 

      return  res.status(200).json({success : true , message : "data fetched" ,  data : {
            courseDetails ,
            progress : currentUserCourseProgress?.lectureProgress,
            completed : currentUserCourseProgress?.completed,
            completionData : currentUserCourseProgress?.completionDate,
            isPurchased : true
        }})

    }catch(err){
        console.log(err)
       return res.status(500).json({success : false , message : "error occured"})
    }
}


export const markCurrentLecturedViewed =async (req,res)=>{
    try{    
        const {userId , courseId , lectureId} = req.body

        let progress = await CourseProgress.findOne({userId , courseId})
        console.log(progress , "progress console")

        if(!progress){
            progress = new CourseProgress({
                userId , 
                courseId , 
                lectureProgress : [
                    {
                    lectureId ,
                    viewed : true , 
                    dateViewed : new Date()
                  }
            ]
            })
            await progress.save()
        }else{
            const lectureProgress = progress.lectureProgress.find(item => item.lectureId === lectureId)
            if(lectureProgress){
                lectureProgress.viewed = true
                lectureProgress.dateViewed = new Date()
            }else{
                progress.lectureProgress.push({
                    lectureId ,
                    viewed : true , 
                    dateViewed : new Date()
                })
            }
            await progress.save()
        }

        const course = await Course.findById(courseId)

            if(!course){
                return res.status(500).json({
                    success : false ,
                    message: "no course found by ids"
                })
            }

            const allLectureViewed = progress.lectureProgress.length === 
                                    course.curriculum.length && progress.lectureProgress.every(item => item.viewed)

            if(allLectureViewed){
                progress.completed = true
                progress.completionDate = new Date()
                await progress.save()
            }


            res.status(200).json({
                success :true ,
                message : "all lecture viewed",
                data : progress
            })

        
    }catch(err){
        console.log(err)
        res.status(500).json({success : false , message : "error occured"})
    }
}


export const resetCurrentCourseProgress =async (req,res)=>{
    try{
            const {userId , courseId} = req.body

            const progress = await CourseProgress.findOne({userId , courseId})

            if(!progress){
              return  res.status(500).json({success : false , message : "no progress found for reset"})
            }

            progress.lectureProgress = []
            progress.completed = false
            progress.completionDate = null

            await progress.save()

            return  res.status(200).json({success : true , message : "Course progress has been reset" , data : progress})


    }catch(err){
        console.log(err)
       return res.status(500).json({success : false , message : "error occured"})
    }
}