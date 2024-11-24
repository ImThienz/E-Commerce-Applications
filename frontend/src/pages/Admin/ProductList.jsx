import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Thêm sản phẩm thất bại. Vui lòng thử lại.");
      } else {
        toast.success(`${data.name} đã được tạo`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Thêm sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-10"
      style={{
        backgroundImage:
          "url(https://png.pngtree.com/thumb_back/fh260/background/20230620/pngtree-online-gaming-enthusiast-a-3d-image-of-a-youthful-gamer-playing-image_3648787.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row bg-black bg-opacity-70 p-5 rounded-lg w-full max-w-4xl">
        <AdminMenu />

        <div className="md:w-3/4 p-3">
          <h2 className="text-3xl font-bold text-white mb-5 text-center">
            Thêm Sản Phẩm Mới
          </h2>
          {imageUrl && (
            <div className="text-center mb-5">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px] rounded-lg"
              />
            </div>
          )}
          <div className="mb-3">
            <label className="block mb-2 text-white font-semibold">
              {image ? image.name : "Tải Lên Ảnh"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="block mt-2 p-2 bg-gray-700 text-white w-full border rounded-lg cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="text-white font-semibold">
                Tên Sản Phẩm
              </label>
              <input
                type="text"
                className="p-4 mb-3 w-full border rounded-lg bg-gray-700 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price" className="text-white font-semibold">
                Giá
              </label>
              <input
                type="number"
                className="p-4 mb-3 w-full border rounded-lg bg-gray-700 text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="text-white font-semibold">
                Số Lượng
              </label>
              <input
                type="number"
                className="p-4 mb-3 w-full border rounded-lg bg-gray-700 text-white"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="brand" className="text-white font-semibold">
                Thương Hiệu
              </label>
              <input
                type="text"
                className="p-4 mb-3 w-full border rounded-lg bg-gray-700 text-white"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="description" className="text-white font-semibold">
            Mô Tả
          </label>
          <textarea
            className="p-4 mb-5 w-full border rounded-lg bg-gray-700 text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="stock" className="text-white font-semibold">
                TRONG KHO
              </label>
              <input
                type="number"
                className="p-4 mb-3 w-full border rounded-lg bg-gray-700 text-white"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className="text-white font-semibold">
                Danh Mục
              </label>
              <select
                className="p-4 mb-3 w-full border rounded-lg bg-gray-700 text-white"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Chọn Danh Mục</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="py-4 px-10 mt-5 w-full rounded-lg text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
