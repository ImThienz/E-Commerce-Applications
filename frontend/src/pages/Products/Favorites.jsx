import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import HeartIcon from "./HeartIcon"; // Giả sử có HeartIcon để thêm vào mỗi sản phẩm yêu thích
import { Link } from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-8 md:px-16 lg:px-32">
      <h1 className="text-3xl font-extrabold text-center text-purple-600 mb-8">
        Favorite Products
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.length === 0 ? (
          <p className="text-lg font-medium text-gray-500 text-center col-span-4">
            No favorite products yet.
          </p>
        ) : (
          favorites.map((product) => (
            <div key={product._id} className="w-full p-4">
              <div className="relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[180px] object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
                />
                <HeartIcon product={product} />
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <Link to={`/product/${product._id}`} className="block">
                  <h2 className="text-md font-semibold text-black truncate">
                    {product.name}
                  </h2>
                </Link>

                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    ${product.price}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
