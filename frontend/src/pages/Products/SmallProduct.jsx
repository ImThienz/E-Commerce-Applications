import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[18rem] sm:w-[20rem] mx-auto p-4">
      <div className="relative group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[200px] object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
        />
        <HeartIcon product={product} />
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
        <Link to={`/product/${product._id}`} className="block">
          <h2 className="text-lg font-semibold text-black truncate">
            {product.name}
          </h2>
        </Link>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-primary">
            ${product.price}
          </span>

          {/* Optionally add a rating or other icon */}
          {/* <div className="flex items-center text-yellow-400">
            <FaStar className="mr-1" /> {product.rating}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
