import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  // Hiển thị Loader nếu đang tải
  if (isLoading) return <Loader />;

  // Hiển thị lỗi nếu có lỗi
  if (error) {
    return (
      <Message variant="danger">{error?.data?.error || error.error}</Message>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Danh Sách Đơn Hàng Của Tôi
      </h2>

      {/* Bảng đơn hàng */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-medium">HÌNH ẢNH</th>
              <th className="py-3 px-4 text-left font-medium">MÃ ĐƠN HÀNG</th>
              <th className="py-3 px-4 text-left font-medium">NGÀY TẠO</th>
              <th className="py-3 px-4 text-left font-medium">GIỜ TẠO</th>{" "}
              {/* Cột giờ tạo */}
              <th className="py-3 px-4 text-left font-medium">TỔNG CỘNG</th>
              <th className="py-3 px-4 text-center font-medium">THANH TOÁN</th>
              <th className="py-3 px-4 text-center font-medium">GIAO HÀNG</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {/* Duyệt qua danh sách đơn hàng */}
            {orders.map((order) => {
              const createdDate = new Date(order.createdAt);
              const createdDateStr = createdDate.toLocaleDateString("vi-VN"); // Ngày
              const createdTimeStr = createdDate.toLocaleTimeString("vi-VN", {
                hour12: false,
              }); // Giờ

              return (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  {/* Hình ảnh sản phẩm đầu tiên trong đơn hàng */}
                  <td className="py-4 px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>

                  {/* Mã đơn hàng */}
                  <td className="py-4 px-4">{order._id}</td>

                  {/* Ngày tạo đơn hàng */}
                  <td className="py-4 px-4">{createdDateStr}</td>

                  {/* Giờ tạo đơn hàng */}
                  <td className="py-4 px-4">{createdTimeStr}</td>

                  {/* Tổng cộng */}
                  <td className="py-4 px-4">${order.totalPrice}</td>

                  {/* Trạng thái thanh toán */}
                  <td className="py-4 px-4 text-center">
                    {order.isPaid ? (
                      <span className="inline-block bg-green-100 text-green-700 py-1 px-3 rounded-full text-sm">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="inline-block bg-red-100 text-red-700 py-1 px-3 rounded-full text-sm">
                        Chưa thanh toán
                      </span>
                    )}
                  </td>

                  {/* Trạng thái giao hàng */}
                  <td className="py-4 px-4 text-center">
                    {order.isDelivered ? (
                      <span className="inline-block bg-green-100 text-green-700 py-1 px-3 rounded-full text-sm">
                        Đã giao
                      </span>
                    ) : (
                      <span className="inline-block bg-red-100 text-red-700 py-1 px-3 rounded-full text-sm">
                        Chưa giao
                      </span>
                    )}
                  </td>

                  {/* Xem chi tiết đơn hàng */}
                  <td className="py-4 px-4 text-center">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition">
                        Xem chi tiết
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrder;
