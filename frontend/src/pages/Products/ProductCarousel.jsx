import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 lg:block xl:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="bg-white shadow-lg rounded-lg p-6">
                <div className="relative">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-[300px] object-cover rounded-lg"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black opacity-50 rounded-lg"></div>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-black">{name}</h2>
                  <p className="text-lg text-primary font-semibold">${price}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {description.substring(0, 170)} ...
                  </p>

                  <div className="mt-4 flex justify-between text-gray-700">
                    <div className="flex flex-col">
                      <h1 className="flex items-center text-sm mb-2">
                        <FaStore className="mr-2 text-black" /> Thương hiệu:{" "}
                        {brand}
                      </h1>
                      <h1 className="flex items-center text-sm mb-2">
                        <FaClock className="mr-2 text-black" /> Thêm vào:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center text-sm mb-2">
                        <FaStar className="mr-2 text-black" /> Đánh giá:{" "}
                        {numReviews}
                      </h1>
                    </div>

                    <div className="flex flex-col">
                      <h1 className="flex items-center text-sm mb-2">
                        <FaStar className="mr-2 text-black" /> Đánh giá trung
                        bình: {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center text-sm mb-2">
                        <FaShoppingCart className="mr-2 text-black" /> Số lượng:{" "}
                        {quantity}
                      </h1>
                      <h1 className="flex items-center text-sm mb-2">
                        <FaBox className="mr-2 text-black" /> Có sẵn:{" "}
                        {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
