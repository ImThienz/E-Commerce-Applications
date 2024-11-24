import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.error(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/08/hinh-nen-gaming-thumb.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="bg-white bg-opacity-60 p-8 rounded-3xl shadow-xl backdrop-blur-md w-full max-w-md"
        style={{
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Đăng ký
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
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Nhập mật khẩu của bạn"
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
              placeholder="Xác nhận mật khẩu của bạn"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full w-full text-lg font-medium transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
          {isLoading && <Loader />}
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Đã có tài khoản?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-blue-600 font-semibold hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
