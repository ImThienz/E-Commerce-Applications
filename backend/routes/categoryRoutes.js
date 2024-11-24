import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Route tạo danh mục mới (POST)
router.post("/", authenticate, authorizeAdmin, createCategory);

// Route cập nhật danh mục theo ID (PUT)
router.put("/:categoryId", authenticate, authorizeAdmin, updateCategory);

// Route xóa danh mục theo ID (DELETE)
router.delete("/:categoryId", authenticate, authorizeAdmin, removeCategory);

// Route lấy danh sách tất cả danh mục (GET)
router.get("/categories", listCategory);

// Route lấy thông tin danh mục theo ID (GET)
router.get("/:id", readCategory);

export default router;
