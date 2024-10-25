import cloudinary from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,

})


export const UploadMediaToCloudinary = async (filePath) => {
    try{
 
        const result = await cloudinary.v2.uploader.upload(filePath , {
            resource_type : 'auto'
        });

        return result

    }catch(err){
        console.log(err)
        throw new Error("Error uploading to cloudinary v1 ")
    }
}

export const deleteMediaFromCloudinary =async (publicId)=>{
    try{

            await cloudinary.uploader.destroy(publicId)

    }catch(err){
        console.log(err)
        throw new Error("Error deleting to cloudinary")
    }
}