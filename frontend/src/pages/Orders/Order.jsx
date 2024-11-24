import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Đơn hàng đã được thanh toán");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container mx-auto p-6 md:flex space-x-8">
      {/* Order Details Section */}
      <div className="md:w-2/3 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Thông tin đơn hàng
        </h2>
        {order.orderItems.length === 0 ? (
          <Message>Đơn hàng không có sản phẩm</Message>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4">Hình ảnh</th>
                  <th className="py-2 px-4">Sản phẩm</th>
                  <th className="py-2 px-4 text-center">Số lượng</th>
                  <th className="py-2 px-4">Giá mỗi đơn vị</th>
                  <th className="py-2 px-4">Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4 text-center">{item.qty}</td>
                    <td className="py-2 px-4 text-center">{item.price}</td>
                    <td className="py-2 px-4 text-center">
                      $ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="md:w-1/3 bg-white shadow-md rounded-lg p-6 mt-8 md:mt-0">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Tóm tắt đơn hàng
        </h2>
        <div className="space-y-4">
          <p className="flex justify-between">
            <span className="font-semibold">Mã đơn hàng:</span>
            <span>{order._id}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Tên người nhận:</span>
            <span>{order.user.username}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{order.user.email}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Địa chỉ giao hàng:</span>
            <span>
              {order.shippingAddress.street}, {order.shippingAddress.ward},{" "}
              {order.shippingAddress.district}, {order.shippingAddress.city}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Phương thức thanh toán:</span>
            <span>{order.paymentMethod}</span>
          </p>

          <div className="space-y-2 mt-6">
            <div className="flex justify-between">
              <span>Sản phẩm</span>
              <span>${order.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Vận chuyển</span>
              <span>${order.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế</span>
              <span>${order.taxPrice}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span>${order.totalPrice}</span>
            </div>
          </div>

          {!order.isPaid && order.totalPrice > 0 && (
            <div className="mt-6">
              {loadingPay && <Loader />}
              {isPending ? (
                <Loader />
              ) : (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              )}
            </div>
          )}

          {loadingDeliver && <Loader />}
          {userInfo &&
            userInfo.isAdmin &&
            order.isPaid &&
            !order.isDelivered && (
              <div className="mt-4">
                <button
                  onClick={deliverHandler}
                  className="w-full py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  Đánh dấu là đã giao hàng
                </button>
              </div>
            )}

          {order.isPaid && (
            <Message variant="success" className="mt-4">
              Đã thanh toán vào {order.paidAt}
            </Message>
          )}

          {!order.isPaid && (
            <Message variant="danger" className="mt-4">
              Chưa thanh toán
            </Message>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
