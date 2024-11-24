import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/") // Định nghĩa các tuyến đường cho yêu cầu POST và GET trên đường dẫn "/"
  .post(authenticate, createOrder) // POST /: Tạo đơn hàng mới, yêu cầu người dùng phải xác thực.
  .get(authenticate, authorizeAdmin, getAllOrders); // GET /: Lấy tất cả đơn hàng, yêu cầu phải là admin.

router.route("/mine").get(authenticate, getUserOrders); // GET /mine: Lấy các đơn hàng của người dùng hiện tại, yêu cầu người dùng phải xác thực.

router.route("/total-orders").get(countTotalOrders); // GET /total-orders: Lấy tổng số đơn hàng.

router.route("/:id").get(authenticate, findOrderById); // GET /:id: Lấy chi tiết đơn hàng theo ID, yêu cầu người dùng phải xác thực.

router.route("/:id/pay").put(authenticate, markOrderAsPaid); // PUT /:id/pay: Cập nhật trạng thái đơn hàng là đã thanh toán, yêu cầu người dùng phải xác thực.

router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered); // PUT /:id/deliver: Đánh dấu đơn hàng là đã giao, yêu cầu phải là admin.

export default router;
