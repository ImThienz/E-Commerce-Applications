import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories, // Action để set danh sách danh mục vào store
  setProducts, // Action để set danh sách sản phẩm vào store
  setChecked, // Action để set các mục đã được chọn vào store (checked)
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader"; // Component loader cho trạng thái đang tải
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch(); // Khởi tạo dispatch từ Redux
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  ); // Lấy dữ liệu từ store Redux

  const categoriesQuery = useFetchCategoriesQuery(); // Gọi API để lấy danh mục sản phẩm
  const [priceFilter, setPriceFilter] = useState(""); // Lưu trữ giá lọc người dùng nhập vào

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked, // Mảng các mục đã chọn (checkbox)
    radio, // Mảng các giá trị lọc radio (nếu có)
  });

  // useEffect để xử lý khi dữ liệu danh mục đã được tải
  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data)); // Lưu danh mục vào Redux store
    }
  }, [categoriesQuery.data, dispatch]); // Chạy khi dữ liệu danh mục thay đổi

  // useEffect để xử lý khi có thay đổi trong các bộ lọc (checked, radio, priceFilter)
  useEffect(() => {
    if (!checked.length || !radio.length) {
      // Kiểm tra nếu không có bộ lọc đã chọn
      if (!filteredProductsQuery.isLoading) {
        // Kiểm tra nếu dữ liệu sản phẩm đã tải xong
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Lọc sản phẩm theo giá
            return (
              product.price.toString().includes(priceFilter) || // Kiểm tra nếu giá sản phẩm chứa giá lọc (dưới dạng chuỗi)
              product.price === parseInt(priceFilter, 10) // Kiểm tra nếu giá sản phẩm bằng với giá lọc (dưới dạng số nguyên)
            );
          }
        );

        dispatch(setProducts(filteredProducts)); // Lưu sản phẩm đã lọc vào Redux store
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]); // Dependency để theo dõi thay đổi

  // Xử lý khi người dùng nhấp vào một thương hiệu
  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand)); // Lưu danh sách sản phẩm theo thương hiệu vào Redux store
  };

  // Xử lý sự kiện checkbox, cập nhật các mục đã chọn
  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id] // Nếu giá trị là true, thêm id vào mảng checked
      : checked.filter((c) => c !== id); // Nếu không, loại bỏ id khỏi mảng checked
    dispatch(setChecked(updatedChecked)); // Cập nhật mảng checked vào Redux store
  };

  // Lấy danh sách các thương hiệu duy nhất từ dữ liệu sản phẩm
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  return (
    <>
      <div className="container mx-auto p-5">
        <div className="flex md:flex-row space-x-4">
          {/* Sidebar - Filters */}
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md w-full md:w-[18rem]">
            <h2 className="text-xl font-semibold text-center py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-5">
              Lọc theo danh mục
            </h2>

            <div className="space-y-4">
              {categories?.map((c) => (
                <div key={c._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${c._id}`}
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-5 h-5 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-pink-500"
                  />
                  <label
                    htmlFor={`category-${c._id}`}
                    className="ml-3 text-sm font-medium"
                  >
                    {c.name}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-center py-3 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full mt-8 mb-5">
              Lọc theo thương hiệu
            </h2>

            <div className="space-y-4">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center">
                  <input
                    type="radio"
                    id={`brand-${brand}`}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-5 h-5 text-teal-500 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="ml-3 text-sm font-medium"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition duration-200"
                onClick={() => window.location.reload()}
              >
                Đặt lại
              </button>
            </div>
          </div>

          {/* Product List */}
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold text-center mb-5">
              {products?.length} Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    key={p._id}
                  >
                    <div className="flex flex-col">
                      <ProductCard p={p} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
