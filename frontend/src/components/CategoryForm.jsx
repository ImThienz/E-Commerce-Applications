const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "ok tạo",
  handleDelete,
}) => {
  return (
    <div className="max-w-lg mx-auto p-8 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">
          Tạo danh mục mới{" "}
        </h2>

        <div className="relative">
          <input
            type="text"
            className="w-full py-3 px-6 text-lg text-gray-800 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 bg-white"
            placeholder="nhập tên "
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
            <i className="fas fa-tag"></i>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="w-full py-3 px-6 text-white bg-gradient-to-r from-green-400 to-teal-500 rounded-xl shadow-lg hover:from-green-500 hover:to-teal-600 transition duration-200"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-3 px-6 text-white bg-red-500 rounded-xl shadow-lg hover:bg-red-600 transition duration-200"
            >
              Xóa
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
