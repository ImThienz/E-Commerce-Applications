import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (item, qty) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <div className="container max-w-screen-xl mx-auto mt-12 px-4">
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">
            Giỏ hàng của bạn đang trống.
          </p>
          <Link
            to="/shop"
            className="text-lg font-semibold text-pink-500 hover:text-pink-700 transition-colors"
          >
            Đi đến cửa hàng
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap justify-between gap-8">
          {/* Cart items section */}
          <div className="w-full lg:w-8/12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Giỏ hàng của bạn
            </h1>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center bg-white shadow-lg p-6 rounded-lg mb-6 hover:shadow-2xl transition-shadow"
              >
                <div className="w-24 h-24 overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 ml-6">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-xl font-semibold text-pink-500 hover:text-pink-700 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-500 mt-2">{item.brand}</p>
                  <p className="text-lg font-bold text-gray-800 mt-2">
                    ${item.price.toLocaleString()}
                  </p>
                </div>

                <div className="w-28">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="ml-6 text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart summary section */}
          <div className="w-full lg:w-4/12 bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tổng kết
            </h2>
            <div className="flex justify-between mb-4">
              <span className="text-lg font-medium text-gray-600">
                Sản phẩm
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)} sản phẩm
              </span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-lg font-medium text-gray-600">
                Tổng tiền
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toLocaleString()}{" "}
                $
              </span>
            </div>

            <button
              className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-pink-600 transition-all"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
