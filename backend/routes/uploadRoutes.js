import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// Cấu hình storage này giúp đảm bảo tệp tải lên được lưu vào thư mục uploads/ với tên duy nhất, ngăn việc ghi đè và giúp dễ dàng xác định nguồn gốc của tệp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

// giúp đảm bảo chỉ các tệp hình ảnh hợp lệ (JPEG, PNG, WebP) mới được tải lên
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Hình ảnh đã được tải lên thành công",
        image: `/${req.file.path}`,
      });
    } else {
      res
        .status(400)
        .send({ message: "Không có tệp hình ảnh nào được cung cấp" });
    }
  });
});

export default router;
