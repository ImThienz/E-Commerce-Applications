import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({ productId: params._id, formData });
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Product successfully updated");
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage:
          "url('https://assets.zenn.com/strapi_assets/gaming_logo_aa95c89a4e.png')",
      }}
    >
      <div className="w-full max-w-lg p-6 bg-black bg-opacity-60 rounded-lg">
        <div className="text-2xl text-white mb-4 text-center">
          Cập nhật/Xóa sản phẩm
        </div>

        {image && (
          <div className="text-center mb-4">
            <img
              src={image}
              alt="product"
              className="block mx-auto w-[50%] h-auto mb-3 rounded-lg"
            />
          </div>
        )}

        <div className="mb-4 text-center">
          <label className="text-white bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-lg cursor-pointer">
            {image ? image.name : "Upload Image"}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
            />
          </label>
        </div>

        <div className="p-3">
          <div className="flex flex-wrap gap-5">
            <div className="flex-1">
              <label htmlFor="name" className="text-white">
                Tên Sản Phẩm
              </label>
              <input
                type="text"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="price" className="text-white">
                Giá
              </label>
              <input
                type="number"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <div className="flex-1">
              <label htmlFor="quantity" className="text-white">
                Số Lượng
              </label>
              <input
                type="number"
                min="1"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="brand" className="text-white">
                Thương Hiệu
              </label>
              <input
                type="text"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="text-white">
              Mô Tả
            </label>
            <textarea
              type="text"
              className="p-4 mb-3 bg-[#101011] border rounded-lg w-full text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-between gap-5 mb-4">
            <div className="flex-1">
              <label htmlFor="stock" className="text-white">
                trong Kho 0
              </label>
              <input
                type="number"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="category" className="text-white">
                Danh Mục
              </label>
              <select
                placeholder="Choose Category"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between gap-5">
            <button
              onClick={handleSubmit}
              className="py-4 px-10 rounded-lg text-lg font-bold bg-green-600 text-white"
            >
              cập nhật
            </button>
            <button
              onClick={handleDelete}
              className="py-4 px-10 rounded-lg text-lg font-bold bg-pink-600 text-white"
            >
              xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
