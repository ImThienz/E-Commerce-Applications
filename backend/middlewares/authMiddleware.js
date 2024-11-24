import jwt from "jsonwebtoken"; // Thư viện jwt để làm việc với JSON Web Tokens
import User from "../models/userModel.js"; // Mô hình User để truy vấn dữ liệu người dùng
import asyncHandler from "./asyncHandler.js"; // Công cụ để xử lý bất đồng bộ trong middleware

// Middleware để xác thực người dùng
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Đọc JWT từ cookie 'jwt'
  token = req.cookies.jwt;

  // Kiểm tra nếu có token
  if (token) {
    try {
      // Xác minh token và giải mã thông tin từ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm người dùng trong cơ sở dữ liệu và loại bỏ mật khẩu khỏi đối tượng người dùng
      req.user = await User.findById(decoded.userId).select("-password");

      // Tiếp tục xử lý request
      next();
    } catch (error) {
      res.status(401); // Trả về mã lỗi 401 khi token không hợp lệ
      throw new Error("Không được phép, token không hợp lệ."); // Thông báo lỗi
    }
  } else {
    res.status(401); // Trả về mã lỗi 401 nếu không có token
    throw new Error("Không được phép, không có token."); // Thông báo lỗi nếu không có token
  }
});

// Middleware để phân quyền cho người quản trị (admin)
const authorizeAdmin = (req, res, next) => {
  // Kiểm tra xem người dùng có quyền admin hay không
  if (req.user && req.user.isAdmin) {
    next(); // Tiếp tục nếu là người quản trị
  } else {
    res.status(401).send("Không được phép, không phải là quản trị viên."); // Trả về lỗi nếu không phải người quản trị
  }
};

export { authenticate, authorizeAdmin };
