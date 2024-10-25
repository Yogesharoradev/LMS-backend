import jwt from "jsonwebtoken"


export const Authenticate = (req ,res , next )=>{

const Token = req.cookies.token

if(!Token){
   return res.status(401).json({
        success :false , 
        message :"user is not authenticated"
    })
}

try {
    const payload = jwt.verify(Token, process.env.JWT_SECRET || "JWT_SECRET");

    req.user = payload; 
    
    next();

  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid token"
    });
  }

}