import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [street, setStreet] = useState(shippingAddress.street || "");
  const [ward, setWard] = useState(shippingAddress.ward || "");
  const [district, setDistrict] = useState(shippingAddress.district || "");
  const [city, setCity] = useState(shippingAddress.city || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ street, ward, district, city }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.street) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto mt-10 px-4 lg:px-0">
      <ProgressSteps step1 step2 />
      <div className="mt-16 flex justify-center">
        <form
          onSubmit={submitHandler}
          className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg"
        >
          <h1 className="text-4xl font-bold mb-8 text-center text-gradient">
            Thông tin giao hàng
          </h1>

          {/* Address Fields */}
          <div className="mb-6">
            <label className="block text-xl font-medium mb-3 text-gray-800">
              Địa chỉ đường
            </label>
            <input
              type="text"
              className="w-full p-4 border border-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Nhập địa chỉ đường"
              value={street}
              required
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-xl font-medium mb-3 text-gray-800">
              Phường
            </label>
            <input
              type="text"
              className="w-full p-4 border border-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Nhập phường"
              value={ward}
              required
              onChange={(e) => setWard(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-xl font-medium mb-3 text-gray-800">
              Quận
            </label>
            <input
              type="text"
              className="w-full p-4 border border-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Nhập quận"
              value={district}
              required
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-xl font-medium mb-3 text-gray-800">
              Thành phố
            </label>
            <input
              type="text"
              className="w-full p-4 border border-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Nhập thành phố"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <label className="block text-xl font-medium mb-3 text-gray-800">
              Phương thức thanh toán
            </label>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-gradient"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2 text-lg text-gray-700">
                  PayPal hoặc thẻ tín dụng
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 text-white py-3 px-8 rounded-lg font-semibold text-xl w-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition duration-300"
            type="submit"
          >
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
