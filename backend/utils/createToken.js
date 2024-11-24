import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Tạo JWT với thời gian hết hạn là 1 giờ
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Đặt thời gian hết hạn của token là 1 giờ
  });

  // Thiết lập JWT dưới dạng Cookie HTTP-Only
  res.cookie("jwt", token, {
    httpOnly: true, // Chỉ cho phép truy cập cookie qua HTTP, không thể truy cập từ JavaScript
    secure: process.env.NODE_ENV !== "development", // Đảm bảo cookie chỉ gửi qua HTTPS khi không phải môi trường phát triển
    sameSite: "strict", // Giới hạn việc gửi cookie khi truy cập từ các nguồn bên ngoài
    maxAge: 1 * 60 * 60 * 1000, // Đặt thời gian hết hạn của cookie là 1 giờ (1 giờ = 60 phút * 60 giây * 1000 mili giây)
  });

  // Trả về token đã tạo
  return token;
};

export default generateToken;
