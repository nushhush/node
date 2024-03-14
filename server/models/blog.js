import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: String,
    replies: [Schema.Types.Mixed], // Use Schema.Types.Mixed for nested comments
    createdate: {
        type: Date,
        default: Date.now,
    },
});

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer, // Binary data for the image
        contentType: String // Mime type of the image
    },
    comments: [commentSchema],
    createdate: {
        type: Date,
        default: Date.now,
    },
    updatedat: {
        type: Date,
        default: Date.now,
    },
});

const Blog = mongoose.model('Blogs', blogSchema);

export default Blog;
