import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Sử dụng trình phân tích URL mới
      useUnifiedTopology: true, // Đảm bảo kết nối ổn định hơn
    });

    console.log(`✅ Kết nối thành công đến MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1); // Dừng ứng dụng nếu không kết nối được
  }
};

export default connectDB;
