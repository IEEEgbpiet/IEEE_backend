import express from "express";
import { Addnew, Getall, Delete, Edit } from "./controller.js";
import verifyToken from "../../middleware/auth.middleware.js";
import { uploadSingleImage } from "../../config/multer.js";

const router = express.Router();

router.post("/Createnew", verifyToken, uploadSingleImage("image"), Addnew);
router.get("/getAll", Getall);
router.delete("/delete/:id", verifyToken, Delete);
router.patch("/edit/:id", verifyToken, uploadSingleImage("image"), Edit);

export default router;
