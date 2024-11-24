// Hàm thêm dấu thập phân cho số
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Hàm cập nhật giỏ hàng
export const updateCart = (state) => {
  // Tính tổng giá trị các mặt hàng
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Tính phí vận chuyển
  state.shippingPrice = addDecimals(state.itemsPrice > 0 ? 0 : 0);

  // Tính phí thuế
  state.taxPrice = addDecimals(Number((0 * state.itemsPrice).toFixed(2)));

  // Tính tổng giá trị giỏ hàng
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Lưu giỏ hàng vào localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
