const express = require("express");
const { loginAdmin,blogs,approve } = require("../controllers/admin.controller.js");
const { adminAuth } = require("../middlewares/adminAuth.js")

const router = express.Router();

router.post("/login",loginAdmin);
router.get("/blogs",adminAuth,blogs)
router.patch("/blogs/:id/:action", adminAuth,approve);


module.exports = router;