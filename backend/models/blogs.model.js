const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    content: {
        type : String,
        required : true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    isApproved: {
        type: Boolean,
        default: false,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Blog };