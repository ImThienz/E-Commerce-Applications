import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
// Component AdminRoute: Bảo vệ route chỉ dành cho admin
const AdminRoute = () => {
  // Lấy thông tin người dùng từ Redux store
  const { userInfo } = useSelector((state) => state.auth);
  // userInfo chứa thông tin người dùng hiện tại, bao gồm quyền (isAdmin)

  // Kiểm tra nếu người dùng đã đăng nhập và là admin
  return userInfo && userInfo.isAdmin ? (
    <Outlet /> // Nếu là admin, hiển thị các route con (Outlet)
  ) : (
    <Navigate to="/login" replace /> // Nếu không phải admin, chuyển hướng tới trang đăng nhập
  );
};

export default AdminRoute;
