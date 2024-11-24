import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    // Trường 'user' chứa thông tin người dùng (ref tới model "User")
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    // Trường 'orderItems' là một mảng chứa các sản phẩm trong đơn hàng
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],

    // Địa chỉ giao hàng với các trường con chi tiết
    shippingAddress: {
      street: {
        type: String,
        required: true, // Tên đường/phố bắt buộc
      },
      ward: {
        type: String,
        required: true, // Phường (hoặc xã) bắt buộc
      },
      district: {
        type: String,
        required: true, // Quận (hoặc huyện) bắt buộc
      },
      city: {
        type: String,
        required: true, // Thành phố bắt buộc
      },
    },

    // Phương thức thanh toán, ví dụ như 'credit card' hoặc 'PayPal'
    paymentMethod: {
      type: String,
      required: true,
    },

    // Thông tin kết quả thanh toán (nếu có)
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    // Giá trị của các sản phẩm trong đơn hàng
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // Thuế phải trả trên đơn hàng
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // Phí vận chuyển của đơn hàng
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // Tổng giá trị của đơn hàng (bao gồm sản phẩm, thuế và phí vận chuyển)
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // Trạng thái thanh toán của đơn hàng (đã thanh toán hay chưa)
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Thời gian thanh toán (nếu có)
    paidAt: {
      type: Date,
    },

    // Trạng thái giao hàng của đơn hàng (đã giao hay chưa)
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Thời gian giao hàng
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
