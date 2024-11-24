import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="container mx-auto p-6">
          <AdminMenu />

          <h2 className="text-2xl font-semibold mb-6">Danh sách Đơn hàng</h2>

          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4 text-left">SẢN PHẨM</th>
                <th className="py-3 px-4 text-left">MÃ ĐƠN HÀNG</th>
                <th className="py-3 px-4 text-left">NGƯỜI DÙNG</th>
                <th className="py-3 px-4 text-left">NGÀY</th>
                <th className="py-3 px-4 text-left">TỔNG TIỀN</th>
                <th className="py-3 px-4 text-left">ĐÃ THANH TOÁN</th>
                <th className="py-3 px-4 text-left">ĐÃ GIAO</th>
                <th className="py-3 px-4 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">
                    {order.user ? order.user.username : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>
                  <td className="py-3 px-4">$ {order.totalPrice}</td>
                  <td className="py-3 px-4">
                    {order.isPaid ? (
                      <span className="text-green-600 bg-green-200 py-1 px-3 rounded-full text-sm">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="text-red-600 bg-red-200 py-1 px-3 rounded-full text-sm">
                        Chưa thanh toán
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {order.isDelivered ? (
                      <span className="text-green-600 bg-green-200 py-1 px-3 rounded-full text-sm">
                        Đã giao
                      </span>
                    ) : (
                      <span className="text-red-600 bg-red-200 py-1 px-3 rounded-full text-sm">
                        Chưa giao
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">
                        Xem chi tiết
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderList;
