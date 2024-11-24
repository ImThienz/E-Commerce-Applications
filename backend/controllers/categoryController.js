import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Tạo mới danh mục
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = new Category({ name });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory); // Trả về danh mục mới tạo với mã 201 (Created)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Cập nhật danh mục
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;

    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory); // Trả về danh mục đã cập nhật với mã 200 (OK)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Xóa danh mục
const removeCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const removed = await Category.findByIdAndDelete(categoryId); // Thay thế findByIdAndRemove với findByIdAndDelete

    if (!removed) {
      return res.status(404).json({ error: "Category not found" });
    }

    res
      .status(200)
      .json({ message: `Category ${removed.name} has been deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Lấy danh sách tất cả danh mục
const listCategory = asyncHandler(async (req, res) => {
  try {
    const allCategories = await Category.find({});
    res.status(200).json(allCategories); // Trả về danh sách với mã 200 (OK)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching categories" });
  }
});

// Lấy thông tin một danh mục theo ID
const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category); // Trả về danh mục với mã 200 (OK)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching category" });
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
