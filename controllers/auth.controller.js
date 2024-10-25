import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const RegisterUser = async(req,res)=>{
    try{

        const {name , email , password , role} = req.body

        const user = await User.findOne({email})
       
        if(user){
           return res.status(500).json({
                success :false ,
                message : "user already exist"
              })
        }

        const hashPass = await bcrypt.hash(password , 10)

        const newUser = new User({name , email , password : hashPass , role })

        await newUser.save()

        return res.json({
            success :true , 
            message : "user register succesfully"
        })

    }catch(err){
       return res.status(500).json({succes :false , message : "error in signup"})
    }
}


export const LoginUser = async(req,res )=>{
    try{

        const {email , password} = req.body

        if(!email || !password){
          return  res.status(500).json({success: false , message : "fill all fields"})
        }

        const user = await User.findOne({email})

        if(!user){
          return  res.status(401).json({success: false , message : "user not exist ! signup"})
        }

        const pass = await bcrypt.compare(password , user.password)

        if(!pass){
          return  res.status(401).json({success: false , message : "Incorrect Password"})
        }

        const payload = {
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        }

        const accessToken = jwt.sign(payload , "JWT_SECRET" , {expiresIn : "7d"} )

        res.cookie("token" , accessToken , { httpOnly: true, secure: false ,  maxAge: 172800000})

        return res.status(200).json({
            success : true, 
            message : "login in successfully",
            data : {
                accessToken , 
                payload
            }  
        })


    }catch(err){
        res.status(500).json({success: false , message : " error in Login"})
    }
}

export const LogoutUser = async(req,res)=>{
    try{    

        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });

    }catch(err){
        res.status(500).json({success: false , message : "error in logout"})
    }
}