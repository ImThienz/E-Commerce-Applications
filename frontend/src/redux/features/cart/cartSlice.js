import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cartUtils";

// Khởi tạo trạng thái ban đầu cho giỏ hàng.
// Nếu có dữ liệu giỏ hàng trong localStorage, thì khôi phục nó, ngược lại, sử dụng giá trị mặc định.
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart")) // Lấy giỏ hàng đã lưu từ localStorage và phân tích JSON.
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" }; // Nếu không có giỏ hàng, tạo giá trị mặc định.

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action để thêm một mặt hàng vào giỏ hàng
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload; // Loại bỏ các thuộc tính không cần thiết từ mặt hàng.
      const existItem = state.cartItems.find((x) => x._id === item._id); // Kiểm tra xem mặt hàng đã tồn tại trong giỏ hay chưa.

      if (existItem) {
        // Nếu mặt hàng đã có trong giỏ, cập nhật thông tin của mặt hàng đó.
        state.cartItems = state.cartItems.map(
          (x) => (x._id === existItem._id ? item : x) // Thay thế mặt hàng cũ bằng mặt hàng mới.
        );
      } else {
        // Nếu mặt hàng chưa có trong giỏ, thêm mặt hàng mới vào giỏ.
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state, item); // Cập nhật lại giỏ hàng (tính toán lại các giá trị tổng).
    },

    // Action để xóa một mặt hàng khỏi giỏ hàng
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload); // Lọc bỏ mặt hàng có _id tương ứng với payload.
      return updateCart(state); // Cập nhật lại giỏ hàng sau khi xóa mặt hàng.
    },

    // Action để lưu địa chỉ vận chuyển
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload; // Lưu địa chỉ vận chuyển vào trạng thái.
      localStorage.setItem("cart", JSON.stringify(state)); // Lưu giỏ hàng vào localStorage để duy trì trạng thái.
    },

    // Action để lưu phương thức thanh toán
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload; // Lưu phương thức thanh toán vào trạng thái.
      localStorage.setItem("cart", JSON.stringify(state)); // Lưu giỏ hàng vào localStorage để duy trì trạng thái.
    },

    // Action để xóa tất cả các mặt hàng trong giỏ hàng
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state)); // Lưu giỏ hàng (đã trống) vào localStorage.
    },

    // Action để khôi phục giỏ hàng về trạng thái ban đầu (dữ liệu mặc định)
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
