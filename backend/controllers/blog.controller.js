const {Blog} = require("../models/blogs.model.js");
const cloudinary = require("cloudinary").v2;

const createBlog = async(req,res) => {
    try {
        console.log("Logged-in user ID:", req.user._id)
        const {title,content} = req.body;

        if(!title || !content || !req.file)
        {
            return res.status(400).json({message:"all fields are"});
        }
        
        const result = await cloudinary.uploader.upload(req.file.path,{
          folder:"blogs"
        });

        const blog = new Blog({
            title,
            content,
            author:req.user._id,
            image: {
              url:result.secure_url,
              public_id:result.public_id
            },
            isApproved: false,
        })

        await blog.save();    
        res.status(201).json({message:"Blog submitted successfully"})
    }
    catch(err) {
    res.status(500).json({success: false,message: "Server error",statusCode: 500,});
  }   
};


const getBlogs = async (req, res) => {
  try {
    const userId = req.user?._id?.toString(); 
    console.log("userId from JWT:", userId);

    const blogs = await Blog.find({ isApproved: true }).populate("author", "name");

    const modifiedBlogs = blogs.map((blog) => {
      const blogLikes = (blog.likes || [])
      .filter((id) => id)
      .map((id) => id.toString()); 
      return {
        ...blog._doc,
        liked: userId ? blogLikes.includes(userId) : false,
        likesCount: blogLikes.length,
      };
    });

    res.status(200).json({success: true,data: modifiedBlogs,message: "All blogs fetched"});  

  } catch (err) {
    console.error("Error in getBlogs:", err); 
    res.status(500).json({
      success: false,
      message: "Server error",
      statusCode: 500,
    });
  }
};


const toggleLike = async(req,res) => {
  try 
  {
    const userId = req.user._id
    const blogId = req.params.id
    const blog = await Blog.findById(blogId)
    const alrLiked = blog.likes.includes(userId);

    if(alrLiked)       //unlike
    {
      blog.likes = blog.likes.filter(id =>id.toString() !== userId.toString())
      await blog.save()
      return res.status(200).json({message:"Blog unliked"});
    }
    else
    {
      blog.likes.push(userId);        //like
      await blog.save();
      return res.status(200).json({message:"Blog liked"});
    }
  }
  catch(error)
  {
    return res.status(500).json({message:"somethinf went wrong"})
  }
}

module.exports = {
  createBlog,
  getBlogs,
  toggleLike
}