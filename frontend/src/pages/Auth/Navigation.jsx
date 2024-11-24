import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount"; // Component đếm số lượng yêu thích

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth); // Thông tin người dùng từ Redux
  const { cartItems } = useSelector((state) => state.cart); // Thông tin giỏ hàng từ Redux

  // State quản lý dropdown và sidebar
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Mở/đóng dropdown
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar); // Mở/đóng sidebar
  };

  const closeSidebar = () => {
    setShowSidebar(false); // Đóng sidebar
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation(); // API logout

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap(); // Gọi API logout
      dispatch(logout()); // Xóa thông tin đăng nhập trong Redux
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
    } catch (error) {
      console.error(error); // In lỗi ra console nếu có
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-[100vh] fixed `}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        {/* Liên kết đến trang chủ */}
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">TRANG CHỦ</span>
        </Link>

        {/* Liên kết đến cửa hàng */}
        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">CỬA HÀNG</span>
        </Link>

        {/* Liên kết đến giỏ hàng */}
        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">GIỎ HÀNG</span>
          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}{" "}
                  {/* Tổng số sản phẩm trong giỏ */}
                </span>
              </span>
            )}
          </div>
        </Link>

        {/* Liên kết đến yêu thích */}
        <Link
          to="/favorite"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <FaHeart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">YÊU THÍCH</span>
          <FavoritesCount />{" "}
          {/* Component hiển thị số lượng sản phẩm yêu thích */}
        </Link>
      </div>

      {/* Dropdown cho người dùng đã đăng nhập */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.username}</span> // Hiển thị tên người dùng
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {/* Menu dropdown */}
        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {/* Nếu người dùng là quản trị viên */}
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Tạo sản phẩm mới
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Danh mục
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    quản lí đơn hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Người dùng
                  </Link>
                </li>
              </>
            )}

            {/* Link hồ sơ người dùng */}
            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Hồ sơ
              </Link>
            </li>

            {/* Button đăng xuất */}
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Nếu người dùng chưa đăng nhập, hiển thị các liên kết đăng nhập và đăng ký */}
      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
              <span className="hidden nav-item-name">ĐĂNG NHẬP</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd size={26} />
              <span className="hidden nav-item-name">ĐĂNG KÝ</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
