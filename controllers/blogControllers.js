const Blog = require("../models/blog")

const blog_index = (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((data) => {
        res.render("index", { title: "All my Blogs", blogs: data })
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_post = (req, res) => {
    Blog.findById(req.params.id)
    .then((data) => {
        res.render("posts", { title: "Blog Post", blog: data })
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_create_get = (req, res) => {
    res.render("create", { title: "Create a new blog" })
}

const blog_create_post = (req, res) => {
    const blog = new Blog(req.body)
    blog.save()
    .then(() => {
        res.redirect("/blogs")
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_delete = (req, res) => {
    Blog.findByIdAndDelete(req.params.id)
    .then(result => {
        res.json({ redirect: '/blogs' });
    })
    .catch(err => {
        res.status(404).render("404", { title: "404" })
    });
}

module.exports = {
    blog_index,
    blog_post,
    blog_create_get,
    blog_create_post,
    blog_delete
}