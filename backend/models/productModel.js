import mongoose from "mongoose"; // Import thư viện Mongoose để tạo và quản lý mô hình (model) MongoDB.
const { ObjectId } = mongoose.Schema; // Lấy ObjectId từ Schema của Mongoose để tham chiếu đến các tài liệu khác.

// Định nghĩa schema cho đánh giá sản phẩm (review).
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên của người đánh giá (kiểu chuỗi, bắt buộc).
    rating: { type: Number, required: true }, // Xếp hạng của đánh giá (kiểu số, bắt buộc).
    comment: { type: String, required: true }, // Nội dung bình luận (kiểu chuỗi, bắt buộc).
    user: {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến ID của người dùng (kiểu ObjectId).
      required: true, // Bắt buộc phải có.
      ref: "User", // Tham chiếu đến mô hình "User" để liên kết với người dùng.
    },
  },
  { timestamps: true } // Tự động thêm các trường createdAt và updatedAt.
);

// Định nghĩa schema cho sản phẩm.
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên sản phẩm (kiểu chuỗi, bắt buộc).
    image: { type: String, required: true }, // URL hoặc đường dẫn tới hình ảnh sản phẩm (kiểu chuỗi, bắt buộc).
    brand: { type: String, required: true }, // Thương hiệu của sản phẩm (kiểu chuỗi, bắt buộc).
    quantity: { type: Number, required: true }, // Số lượng sản phẩm có sẵn (kiểu số, bắt buộc).
    category: { type: ObjectId, ref: "Category", required: true }, // Tham chiếu đến mô hình "Category" để liên kết với danh mục (bắt buộc).
    description: { type: String, required: true }, // Mô tả chi tiết về sản phẩm (kiểu chuỗi, bắt buộc).
    reviews: [reviewSchema], // Mảng chứa các đánh giá (dùng reviewSchema).
    rating: { type: Number, required: true, default: 0 }, // Điểm trung bình của sản phẩm (kiểu số, bắt buộc, mặc định là 0).
    numReviews: { type: Number, required: true, default: 0 }, // Số lượng đánh giá (kiểu số, bắt buộc, mặc định là 0).
    price: { type: Number, required: true, default: 0 }, // Giá của sản phẩm (kiểu số, bắt buộc, mặc định là 0).
    countInStock: { type: Number, required: true, default: 0 }, // Số lượng hàng trong kho (kiểu số, bắt buộc, mặc định là 0).
  },
  { timestamps: true } // Tự động thêm các trường createdAt và updatedAt.
);

const Product = mongoose.model("Product", productSchema);
export default Product;
