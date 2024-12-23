import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress.street || !paymentMethod) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress, paymentMethod]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8">
        {cartItems.length === 0 ? (
          <Message>Giỏ hàng của bạn hiện tại trống</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 py-4 text-left bg-gray-100">Hình ảnh</th>
                  <th className="px-3 py-4 text-left bg-gray-100">Sản phẩm</th>
                  <th className="px-3 py-4 text-left bg-gray-100">Số lượng</th>
                  <th className="px-3 py-4 text-left bg-gray-100">Giá</th>
                  <th className="px-3 py-4 text-left bg-gray-100">Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-3">{item.qty}</td>
                    <td className="p-3">${item.price.toFixed(2)}</td>
                    <td className="p-3">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-3xl font-semibold mb-5">Tổng kết đơn hàng</h2>
          <div className="p-8 bg-gray-900 text-white rounded-lg shadow-xl">
            <ul className="text-lg">
              <li className="flex justify-between mb-4">
                <span className="font-semibold">Sản phẩm:</span> ${itemsPrice}
              </li>
              <li className="flex justify-between mb-4">
                <span className="font-semibold">Vận chuyển:</span> $
                {shippingPrice}
              </li>
              <li className="flex justify-between mb-4">
                <span className="font-semibold">Thuế:</span> ${taxPrice}
              </li>
              <li className="flex justify-between mb-6 border-t border-gray-600 pt-4">
                <span className="font-semibold">Tổng cộng:</span> ${totalPrice}
              </li>
            </ul>
            {error && <Message variant="danger">{error.data?.message}</Message>}

            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-3">
                Thông tin giao hàng
              </h2>
              <p>
                <strong>Địa chỉ:</strong> {shippingAddress.street},{" "}
                {shippingAddress.ward}, {shippingAddress.district},{" "}
                {shippingAddress.city}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-3">
                Phương thức thanh toán
              </h2>
              <strong>Phương thức:</strong> {paymentMethod}
            </div>
          </div>

          <button
            type="button"
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 text-white py-3 px-8 rounded-full text-lg w-full mt-6 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition-all"
            disabled={cartItems.length === 0 || isLoading}
            onClick={placeOrderHandler}
          >
            {isLoading ? "Đang đặt hàng..." : "Đặt hàng"}
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
