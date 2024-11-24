import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createUser); // Tạo người dùng mới

router.get("/", authenticate, authorizeAdmin, getAllUsers); // Lấy danh sách tất cả người dùng (yêu cầu xác thực và quyền admin)

router.post("/auth", loginUser); // Đăng nhập người dùng

router.post("/logout", logoutCurrentUser); // Đăng xuất người dùng

router.get("/profile", authenticate, getCurrentUserProfile); // Route lấy thông tin người dùng hiện tại (GET)

router.put("/profile", authenticate, updateCurrentUserProfile); // Route cập nhật thông tin người dùng hiện tại (PUT)

router.delete("/:id", authenticate, authorizeAdmin, deleteUserById); // Route xóa người dùng theo ID (DELETE)

router.get("/:id", authenticate, authorizeAdmin, getUserById); // Route lấy thông tin người dùng theo ID (GET)

router.put("/:id", authenticate, authorizeAdmin, updateUserById); // Route cập nhật người dùng theo ID (PUT)

export default router;
