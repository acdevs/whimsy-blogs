import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    snippet: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    featuredImage: {
        type: String,
    },
    author: {
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username : {
            type: String,
            required: true,
            index: true,
        },
        fullName : {
            type: String,
            required: true,
            index: true,
        },
    },
    premium: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    tags: [{
        type: String,
    }],
    category: {
        type: String,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    views: {
        type: Number,
        default: 0,
    },
    readTime: {
        type: String,
    },
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema) //singular name of the collection

blogSchema.index({ title: 'text', snippet: 'text', content: 'text', 'author.fullName': 'text' })

export default Blog