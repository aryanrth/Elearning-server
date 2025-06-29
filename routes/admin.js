import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import {
  addLecture,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from "../controller/admin.js";
import { uploadFiles } from "../middlewares/multer.js";
import { get } from "mongoose";

const router = express.Router();
router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLecture);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);

router.get("/stats",isAuth,isAdmin,getAllStats)
router.put('/user/:id',isAuth,isAdmin,updateRole);
router.get("/users",isAuth,isAdmin,getAllUser);
export default router;
