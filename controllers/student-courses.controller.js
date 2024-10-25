import StudentCourses from "../models/studentCourses.model.js"


export const getCoursesById = async (req,res)=>{
    try{

        const {studentId} = req.params

        const StudentBoughtCourses = await StudentCourses.findOne({ userId : studentId})

        if(!StudentBoughtCourses){
            return res.status(500).json({success: false , message : "not id found"})
        }

       return res.status(200).json({success : true , data : StudentBoughtCourses.courses})

    }catch(err){
        return res.status(500).json({success: false , message : "errore"})
    }
}