const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;


// const blogRoutes = require("./routes/blog.routes.js");
const userRouter = require("./routes/user.routes.js");
const hospRoutes = require("./routes/hosp.routes.js");
// const adminRoutes = require("./routes/admin.routes.js");
// const orderRoutes = require("./routes/order.routes.js");
// const productRoutes = require("./routes/product.routes.js");
const rescRoutes = require("./routes/resc.routes.js")


const app = express();
app.use(cors());
app.use(express.json());


// app.use("/blogs", blogRoutes);
app.use("/users", userRouter);
app.use("/hospital", hospRoutes);
// app.use("/admin", adminRoutes);
// app.use("/order", orderRoutes);
// app.use("/product", productRoutes);
app.use("/resc", rescRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



module.exports = app;

