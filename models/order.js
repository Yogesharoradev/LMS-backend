import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({
    userId: String , 
    userName : String,
    userEmail : String,
    orderStatus : String,
    paymentMethod : String ,
    paymentStatus : String,
    orderDate : Date,
    paymentId :String,
    payerId : String,
    instructorId : String ,
    instructorName : String , 
    courseImage : String,
    courseTitle : String,
    courseId : String,
    coursePricing : String,
})

const Orders = mongoose.model("Orders" , OrderSchema)

export default Orders