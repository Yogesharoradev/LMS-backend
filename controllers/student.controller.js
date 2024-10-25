import Course from "../models/course.model.js"
import StudentCourses from "../models/studentCourses.model.js"


export const getStudentCourseData =async (req ,res )=>{
    try{

        const {
            category = [] ,
             level = [] , 
             primaryLanguage = [] ,
              sortBy = "price-lowtohigh"
            } = req.query

            let filters = {}

            if(category.length){
             filters.category = {$in : category.split(",")}
            }
            if(level.length){
            filters.level = {$in : level.split(",")}
            } 
            if(primaryLanguage.length){
                 filters.primaryLanguage = {$in : primaryLanguage.split(",")}
            }

            let sortParams = {}

            switch (sortBy) {
                case "price-lowtohigh" : 
                    sortParams.pricing = 1
                    break;
                    case "price-hightolow" : 
                    sortParams.pricing = -1
                    break;
                    case "title-atoz" : 
                    sortParams.pricing = 1
                    break;
                    case "title-ztoa" : 
                    sortParams.pricing = -1
                    break;
                default:
                    sortParams.pricing = 1
                    break;
            }

        const result = await Course.find(filters).sort(sortParams)

        return  res.status(200).json({ success :true , message: "data fetched" , result })

    }catch(err){
        console.log(err)
       return res.status(500).json({ success :false , message: " error in getting data" })
    }
}


export const getStudentCourseDetailsById =async (req ,res )=>{
    try{

        const {id , studentId} = req.params

        const response = await Course.findById(id)

        if(!response){
            return res.status(500).json({ success :false , message: "id not available" })
        }

        //checking if course already bought or not

        const studentBoughtCourses = await StudentCourses.findOne({
         userId : studentId
        })

        const IsCourseBoughtByStudent = studentBoughtCourses?.courses?.findIndex((item) => item.courseId === id) > -1

        return res.status(200).json({ success :true , message: "data by id fetched successfully" ,
             response ,
            isCoursepurchased : IsCourseBoughtByStudent 
        })

    }catch(err){
        console.log(err)
       return res.status(500).json({ success :false , message: " error in getting details" })
    }
}
