import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    snippet: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author: {
        id : {
            type: String,
            required: true
        },
        alias : {
            type: String,
            required: true
        }
    } 
        
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema) //singular name of the collection

// create index for search
blogSchema.index({title: 'text', snippet : 'text', body : 'text', 'author.alias' : 'text'})

export default Blog