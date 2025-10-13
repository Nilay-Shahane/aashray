const express = require("express");
const { getBlogs, createBlog, toggleLike } = require("../controllers/blog.controller.js");
const multer = require("multer");
const {jwtAuthMiddleware} = require("../middleware/UserAuth.js");
const {optionalAuth} = require("../middleware/optionalAuth.js")
const {anyUserAuth} = require("../middleware/anyUserAuth.js")

const storage = multer.diskStorage({});
const upload = multer({storage})

const router = express.Router();

router.get("/all",optionalAuth,getBlogs);
router.post("/create",jwtAuthMiddleware,upload.single("image"),createBlog);
router.patch("/:id/toggleLike",anyUserAuth,toggleLike)

module.exports = router;