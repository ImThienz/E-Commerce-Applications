// Thêm sản phẩm vào localStorage
export const addFavoriteToLocalStorage = (product) => {
  // Lấy danh sách yêu thích hiện tại từ localStorage
  const favorites = getFavoritesFromLocalStorage();

  // Kiểm tra xem sản phẩm đã có trong danh sách chưa
  if (!favorites.some((p) => p._id === product._id)) {
    // Nếu chưa có, thêm sản phẩm vào danh sách
    favorites.push(product);

    // Cập nhật lại danh sách vào localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

// Xóa sản phẩm khỏi localStorage
export const removeFavoriteFromLocalStorage = (productId) => {
  // Lấy danh sách yêu thích từ localStorage
  const favorites = getFavoritesFromLocalStorage();

  // Lọc ra danh sách yêu thích mới mà không có sản phẩm cần xóa
  const updateFavorites = favorites.filter(
    (product) => product._id !== productId
  );

  // Cập nhật lại danh sách vào localStorage
  localStorage.setItem("favorites", JSON.stringify(updateFavorites));
};

// Lấy danh sách yêu thích từ localStorage
export const getFavoritesFromLocalStorage = () => {
  // Lấy dữ liệu từ localStorage
  const favoritesJSON = localStorage.getItem("favorites");

  // Nếu có dữ liệu, chuyển nó thành mảng; nếu không, trả về mảng rỗng
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
};
