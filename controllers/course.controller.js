import Course from "../models/course.model.js";


export const addNewCourse = async(req ,res) => {
        try{    

            const courseData = req.body;

            const newAddedCourse =  new Course(courseData)

           const data = await newAddedCourse.save()

            return  res.status(201).json({success : true , message : "successfully created", data })

        }catch(err){
            console.log(err)
          return  res.status(500).json({success : false , message : "error in adding Course"})
        }
}


export const getAllCourses = async(req ,res) => {
    try{    
        const coursesList = await Course.find({})

        return  res.status(200).json({success : true , message : "all courses in db" , coursesList})

    }catch(err){
       return res.status(500).json({success : false , message : "error in getting all Course"})
    }
}


export const getCourseDetailsById = async(req ,res) => {
    try{

        const {id} = req.params

        const courseDetails = await Course.findById(id)

        if(!courseDetails){
        return    res.status(500).json({success : false , message : "invalid id"})
        }

      return  res.status(200).json({success : true , data : courseDetails })

    }catch(err){
        return  res.status(500).json({success : false , message : "error in getting details Course"})
    }
}


export const UpdateCourseById = async(req ,res) => {
    try{

        
        const {id} = req.params
        const courseData = req.body

        const updatedCourse = await Course.findByIdAndUpdate(id , courseData , {new: true})

        if(!updatedCourse){
        return    res.status(500).json({success : false , message : "cannot update"})
        }

      return  res.status(200).json({success : true ,message : "upated successfully", data : updatedCourse })


    }catch(err){
        console.log(err)
        return    res.status(500).json({success : false , message : "error in updating Course"})
    }
}


export const DeleteCourseById = async( req , res)=>{
    try{
 
        const {id} = req.params

        const deletedCourse = await Course.findByIdAndDelete(id)

        if(!deletedCourse){
        return    res.status(500).json({success : false , message : "cannot delete try later"})
        }

      return  res.status(200).json({success : true ,message : "deleted successfully" })


    }catch(err){
        return    res.status(500).json({success : false , message : "error in updating Course"})
    }
}
