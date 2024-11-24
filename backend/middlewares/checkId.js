import { isValidObjectId } from "mongoose";

// Middleware để kiểm tra tính hợp lệ của ObjectId trong yêu cầu.
function checkId(req, res, next) {
  // Kiểm tra nếu ObjectId trong tham số yêu cầu không hợp lệ.
  if (!isValidObjectId(req.params.id)) {
    res.status(404); // Đặt mã trạng thái HTTP là 404 (Not Found).
    throw new Error(`Invalid Object of: ${req.params.id}`); // Ném lỗi với thông báo ID không hợp lệ.
  }
  next(); // Gọi hàm tiếp theo nếu ObjectId hợp lệ.
}

export default checkId;
