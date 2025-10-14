const express = require("express");
const { loginAdmin,blogs,approve } = require("../controllers/admin.controller.js");
const { adminAuth } = require("../middlewares/adminAuth.js")

const adminRouter = express.Router();

adminRouter.post("/login",loginAdmin);
adminRouter.get("/blogs",adminAuth,blogs)
adminRouter.patch("/blogs/:id/:action", adminAuth,approve);


module.exports = adminRouter;