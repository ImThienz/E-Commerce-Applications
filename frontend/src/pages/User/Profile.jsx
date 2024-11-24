import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/thumb_back/fh260/background/20230712/pngtree-modern-black-joysticks-set-on-abstract-light-wallpaper-perfect-for-gaming-image_3865865.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="bg-white bg-opacity-70 p-8 rounded-3xl shadow-xl backdrop-blur-md w-full max-w-lg"
        style={{
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Cập nhật thông tin cá nhân
        </h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-800"
            >
              Tên người dùng
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 p-3 border border-gray-300 rounded-full w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Nhập tên của bạn"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Địa chỉ Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 p-3 border border-gray-300 rounded-full w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 p-3 border border-gray-300 rounded-full w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-800"
            >
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-2 p-3 border border-gray-300 rounded-full w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-medium transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              {loadingUpdateProfile ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            <Link
              to="/user-orders"
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-full text-lg font-medium transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              Đơn hàng của tôi
            </Link>
          </div>
          {loadingUpdateProfile && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default Profile;
