import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Tạo đơn hàng mới
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    // Lấy chi tiết đơn hàng
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    // Thanh toán đơn hàng
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    // Lấy ID khách hàng Paypal
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    // Lấy tất cả đơn hàng của người dùng đã đăng nhập
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Lấy tất cả đơn hàng (dành cho quản trị viên)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),

    // Đánh dấu đơn hàng là đã giao
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    // Lấy tổng số đơn hàng
    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),
  }),
});

export const {
  useCreateOrderMutation, // Tạo đơn hàng mới
  useGetOrderDetailsQuery, // Lấy chi tiết đơn hàng
  usePayOrderMutation, // Thanh toán đơn hàng
  useGetPaypalClientIdQuery, // Lấy ID khách hàng Paypal
  useGetMyOrdersQuery, // Lấy đơn hàng của người dùng hiện tại
  useDeliverOrderMutation, // Đánh dấu đơn hàng là đã giao
  useGetOrdersQuery, // Lấy tất cả đơn hàng
  useGetTotalOrdersQuery, // Lấy tổng số đơn hàng
} = orderApiSlice;
