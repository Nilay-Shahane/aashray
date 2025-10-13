const { Admin } = require("../models/admin.models.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/generateToken.js");
const {Blog} = require("../models/blogs.models.js")


// const regAdmin = async(req,res) => {
//     try {
//         const {username, password} = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ message: "Username and password are required" });
//         }

//         const exists = await Admin.findOne({username});
//         if(exists) {
//             return res.status(400).json({message:"Admin already exists"})
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashPass = await bcrypt.hash(password,salt)

//         const newAdmin = new Admin({
//             username,
//             password:hashPass
//         })
//         await newAdmin.save();

//         return res.status(201).json({alert:"admin registered success"})
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).json({error:"Server error"})
//     }
// } 

const loginAdmin = async(req,res)=> {
    try {
        const {username,password} = req.body;

        const admin = await Admin.findOne({username})
        if(!admin || !(await admin.comparePassword(password))) {
            res.status(400).json({message:"invalid cred.."})
        }

        const payload = {
            id:admin.id,
            username:admin.username,
            role: "admin",
        }
        const token = generateToken(payload)
        console.log("Admin token : ",token)
        res.json({message:"login success",token,role: "admin",})
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({error:"server error"})
    }
}

const blogs = async(req,res) => {
    try {
        const blogs = await Blog.find({ isApproved: false });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching blogs",error:err.message });
    }
}

const approve = async (req, res) => {
  const { id, action } = req.params;

  try {
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (action === "approve") {
      blog.isApproved = true;
      await blog.save();
      return res.status(200).json({ message: "Blog approved", blog });
    }

    if (action === "reject") {
      await blog.deleteOne(); 
      return res.status(200).json({ message: "Blog rejected and deleted" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error processing action", error: err.message });
  }
};

module.exports = {
    regAdmin,
    loginAdmin,
    blogs,
    approve,
};