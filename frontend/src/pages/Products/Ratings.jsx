import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color = "yellow-500" }) => {
  // Tính số sao đầy, sao nửa và sao trống
  const fullStars = Math.floor(value);
  const halfStars = value % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      {/* Render sao đầy */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className={`text-${color} ml-1`} />
      ))}

      {/* Render sao nửa */}
      {halfStars === 1 && <FaStarHalfAlt className={`text-${color} ml-1`} />}

      {/* Render sao trống */}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className={`text-${color} ml-1`} />
      ))}

      {/* Hiển thị văn bản nếu có */}
      {text && <span className={`ml-2 text-${color}`}>{text}</span>}
    </div>
  );
};

export default Ratings;
