const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/TMDT", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/v1/category", categoryRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/v1/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
