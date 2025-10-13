const express = require("express");
const { regAdmin, loginAdmin,blogs,approve } = require("../controllers/admin.controller.js");
const { adminAuth } = require("../middleware/adminAuth.js")

const router = express.Router();

router.post("/register",regAdmin);
router.post("/login",loginAdmin);
router.get("/blogs",adminAuth,blogs)
router.patch("/blogs/:id/:action", adminAuth,approve);


module.exports = router;