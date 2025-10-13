const express = require("express");
const { getBlogs, createBlog, toggleLike } = require("../controllers/blog.controller.js");
const multer = require("multer");
const {userAuth} = require("../middlewares/userAuth.js");
const {optionalAuth} = require("../middlewares/optionalAuth.js")


const storage = multer.diskStorage({});
const upload = multer({storage})

const blogRouter = express.Router();

blogRouter.get("/all",optionalAuth,getBlogs);
blogRouter.post("/create",userAuth,upload.single("image"),createBlog);
blogRouter.patch("/:id/toggleLike",optionalAuth,toggleLike)

module.exports = router;