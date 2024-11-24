import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Hàm tiện ích để tính toán giá trị cho một đơn hàng
function calcPrices(orderItems) {
  // Tính tổng giá trị sản phẩm (số lượng * giá)
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 0 ? 0 : 10;

  const taxRate = 0;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  // Tính tổng giá trị đơn hàng (giá sản phẩm + phí vận chuyển + thuế)
  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  // Trả về các giá trị cần thiết cho đơn hàng
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

// Tạo một đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Kiểm tra xem có sản phẩm trong đơn hàng không
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items"); // Nếu không có sản phẩm thì báo lỗi
    }

    // Lấy thông tin sản phẩm từ cơ sở dữ liệu để kiểm tra giá của từng sản phẩm
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Tạo danh sách các sản phẩm trong đơn hàng từ dữ liệu của client và thông tin từ cơ sở dữ liệu
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      // Nếu sản phẩm không tồn tại trong cơ sở dữ liệu
      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      // Trả về thông tin đơn hàng với giá trị cập nhật từ cơ sở dữ liệu
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined, // Loại bỏ _id để tránh trùng lặp
      };
    });

    // Tính toán các giá trị cần thiết (tổng giá sản phẩm, thuế, phí vận chuyển và tổng số tiền)
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    // Tạo một đối tượng đơn hàng mới
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    const createdOrder = await order.save();
    res.status(201).json(createdOrder); // Trả về đơn hàng đã được tạo thành công
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi và trả thông báo lỗi
  }
};

// Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders); // Trả về danh sách tất cả các đơn hàng
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};

// Lấy tất cả đơn hàng của người dùng đã đăng nhập
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders); // Trả về danh sách đơn hàng của người dùng hiện tại
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};

// Đếm tổng số đơn hàng
const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders }); // Trả về tổng số đơn hàng
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};

// Tìm đơn hàng theo ID
const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order); // Trả về thông tin đơn hàng nếu tìm thấy
    } else {
      res.status(404);
      throw new Error("Order not found"); // Nếu không tìm thấy đơn hàng thì báo lỗi
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};

// Đánh dấu đơn hàng là đã thanh toán
const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now(); // Đánh dấu thời gian thanh toán
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder); // Trả về đơn hàng đã cập nhật
    } else {
      res.status(404);
      throw new Error("Order not found"); // Nếu không tìm thấy đơn hàng thì báo lỗi
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};

// Đánh dấu đơn hàng là đã giao
const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now(); // Đánh dấu thời gian giao hàng

      const updatedOrder = await order.save();
      res.json(updatedOrder); // Trả về đơn hàng đã được đánh dấu là đã giao
    } else {
      res.status(404);
      throw new Error("Order not found"); // Nếu không tìm thấy đơn hàng thì báo lỗi
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
