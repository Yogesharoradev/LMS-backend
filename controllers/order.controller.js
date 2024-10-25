import paypal from "../helpers/payal.js"
import Course from "../models/course.model.js"
import Orders from "../models/order.js"
import StudentCourses from "../models/studentCourses.model.js"




export const createOrder = async(req,res)=>{
    try{    
        const {
                userId , 
                userName, 
                userEmail , 
                orderStatus , 
                paymentMethod ,
                paymentStatus , 
                orderDate ,
                paymentId ,
                payerId ,
                instuctorId,
                instructorName, 
                courseImage,  
                courseTitle , 
                courseId ,
                coursePricing, 
        } =  req.body



            const create_payment_json = {
                intent : "sale",
                payer : {
                    payment_method : "paypal"
                },
                redirect_urls : {
                    return_url : `${process.env.PRODUCTION_CLIENT_URL}/payment-return` ,
                    cancel_url : `${process.env.PRODUCTION_CLIENT_URL}/payment-cancel`
                },
                transactions :[
                    {
                        item_list : {
                            items : [
                                {
                                    name: courseTitle , 
                                    sku : courseId , 
                                    price : coursePricing,
                                    currency : "USD",
                                    quantity  : 1
                                }
                            ]
                        },
                        amount : {
                            currency : "USD",
                            total : coursePricing.toFixed(2)
                        },
                        description : courseTitle

                    }
                ]

            }
        
            
            paypal.payment.create(create_payment_json , async(error , paymentInfo)=>{
                    if (error) {
                      console.error("PayPal error details:", error.response?.details); 
                      return res.status(401).json({ success: false, message: "PayPal error occurred" });
                    }else{
                    const newlyCreatedCourseOrder = new Orders({
                        userId , 
                        userName, 
                        userEmail , 
                        orderStatus , 
                        paymentMethod ,
                        paymentStatus , 
                        orderDate ,
                        paymentId ,
                        payerId ,
                        instuctorId,
                        instructorName, 
                        courseImage,  
                        courseTitle , 
                        courseId ,
                        coursePricing, 
                    })

                    await newlyCreatedCourseOrder.save()

                    const aprroveUrl = paymentInfo.links.find(link => link.rel == "approval_url").href

                    return res.status(200).json({success : true ,
                         data :{
                                aprroveUrl ,
                                orderId : newlyCreatedCourseOrder._id
                        } 
                })

                }

            })

    }catch(err){
        console.log(err)
       return res.status(500).json({success : false , message : "some error occured"})
    }
}


export const CapturePayment = async(req,res)=>{
    try{
            const {paymentId , payerId , orderId} = req.body

            let order = await Orders.findById(orderId)

            if(!order){
                return res.status(404).json({success : false , message : "order cannot be found"})
            }

            order.paymentStatus = "paid"
            order.orderStatus = "confirmed"
            order.paymentId = paymentId
            order.payerId = payerId

            await order.save()

            const studentCourse = await StudentCourses.findOne({
                userId : order.userId
            })

            if(studentCourse){
                studentCourse.courses.push({
                    courseId :  order.courseId,
                    title : order.courseTitle,
                    instructorId : order.instructorId,
                    instructorName : order.instructorName,
                    dateOfPurchase : order.orderDate,
                    courseImage : order.courseImage
                })

                await studentCourse.save()
            }else{
                const newStudentCourses = new StudentCourses({
                    userId : order.userId,
                    courses : [{
                        courseId :  order.courseId,
                        title : order.courseTitle,
                        instructorId : order.instructorId,
                        instructorName : order.instructorName,
                        dateOfPurchase : order.orderDate,
                        courseImage : order.courseImage
                    }
                    ]
                })

                await newStudentCourses.save()
            }


            //update the course schema students

            await Course.findByIdAndUpdate(order.courseId , {
                $addToSet :{
                    Students: {
                        studentId : order.userId ,
                        studentName: order.userName,
                        studentEmail : order.userEmail ,
                        paidAmount : order.coursePricing
                    }
                }
            })

            return res.status(200).json({
                success  : true , 
                message : "Order payment Successfuly",
                data : order
            })

    }catch(err){
        console.log(err)
        res.status(500).json({success : false , message : "some error occured"})
    }
}