import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// thêm sp
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Tên là bắt buộc" });
      case !brand:
        return res.json({ error: "Thương hiệu là bắt buộc" });
      case !description:
        return res.json({ error: "Mô tả là bắt buộc" });
      case !price:
        return res.json({ error: "Giá là bắt buộc" });
      case !category:
        return res.json({ error: "Danh mục là bắt buộc" });
      case !quantity:
        return res.json({ error: "Số lượng là bắt buộc" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
//  cập nhật
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Tên là bắt buộc" });
      case !brand:
        return res.json({ error: "Thương hiệu là bắt buộc" });
      case !description:
        return res.json({ error: "Mô tả là bắt buộc" });
      case !price:
        return res.json({ error: "Giá là bắt buộc" });
      case !category:
        return res.json({ error: "Danh mục là bắt buộc" });
      case !quantity:
        return res.json({ error: "Số lượng là bắt buộc" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
// xóa
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});
// lấy tất cả sp
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
// lấy sp theo id
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});
//lấy 12sp mới nhất
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    // Tìm tất cả các sản phẩm, populate thông tin liên quan đến 'category'
    const products = await Product.find({}) // Tìm tất cả sản phẩm trong cơ sở dữ liệu
      .populate("category") // Thêm thông tin từ bảng 'category' vào mỗi sản phẩm
      .limit(12) // Giới hạn chỉ lấy 12 sản phẩm
      .sort({ createAt: -1 }); // Sắp xếp các sản phẩm theo thời gian tạo (mới nhất ở đầu)

    res.json(products); // Trả về danh sách sản phẩm dưới dạng JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
// Hàm xử lý thêm đánh giá cho sản phẩm
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Kiểm tra xem sản phẩm đã được đánh giá chưa
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Sản phẩm đã được đánh giá");
      }

      // Tạo đối tượng đánh giá mới
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      // Cập nhật số lượng đánh giá và điểm đánh giá
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Đánh giá đã được thêm" });
    } else {
      res.status(404);
      throw new Error("Không tìm thấy sản phẩm");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
//lấy danh sách các sản phẩm có điểm đánh giá cao nhất
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
//lấy danh sách các sản phẩm mới nhất
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Lọc theo danh mục sản phẩm category price
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
