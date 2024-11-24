import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Tên danh mục là bắt buộc");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`Danh mục ${result.name} đã được tạo.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo danh mục thất bại, vui lòng thử lại.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Tên danh mục là bắt buộc");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Danh mục ${result.name} đã được cập nhật.`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Danh mục ${result.name} đã bị xóa.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa danh mục thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="ml-[10rem] p-6 flex flex-col items-center">
      <AdminMenu />

      <div className="text-4xl font-bold text-blue-600 mb-6 text-center">
        Quản lý danh mục
      </div>

      <div className="w-full flex justify-between gap-6">
        {/* Left Section: Category Form */}
        <div className="w-full md:w-1/2 p-3 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Thêm mới danh mục
          </h3>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            buttonText="Tạo danh mục"
          />
        </div>

        {/* Right Section: Category List */}
        <div className="w-full md:w-1/2 p-3">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Danh sách danh mục
          </h3>
          <div className="flex flex-wrap gap-4">
            {categories?.map((category) => (
              <div
                key={category._id}
                className="p-3 bg-white border border-gray-200 rounded-lg shadow-md"
              >
                <button
                  className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:outline-none"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Updating Category */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Cập nhật danh mục
          </h3>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Cập nhật"
            handleDelete={handleDeleteCategory}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;
