import express from "express";
import multer from "multer";
import { deleteMediaFromCloudinary, UploadMediaToCloudinary } from "../helpers/cloudinary.js";
import fs from "fs";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        const normalizedPath = req.file.path.replace(/\\/g, "/");
       
        const result = await UploadMediaToCloudinary(normalizedPath);

        fs.unlinkSync(req.file.path);

        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error("Error during file upload:", err); 
        return res.status(500).json({ success: false, message: "Error uploading: " + err.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Asset ID is required." });
        }

        await deleteMediaFromCloudinary(id);

        return res.status(200).json({ success: true, message: "Asset deleted successfully." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Error deleting: " + err.message });
    }
});

router.post("/bulk/upload" , upload.array('files', 10) , async(req,res)=>{
    try{
        const uploadPromise = req.files.map((item)=> UploadMediaToCloudinary(item.path))

        const result = await Promise.all(uploadPromise)

        return res.status(200).json({ success: true, data: result});

    }catch(err){
        return res.status(400).json({ success: false, message: " error in bulk upload" });
    }
})

export default router;
