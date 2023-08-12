const dateFns = require("date-fns")
const Blog = require("../models/blog")

const blog_index = (req, res) => {
    // const page = req.query.p || 0
    // const limit = 2
    // const skip = (page * limit)

    Blog.find()
    .sort({ createdAt: -1 })
    // .skip(skip)
    // .limit(limit)
    .then((data) => {
        data.forEach((blog) => {
            blog.timestamp = dateFns.formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })
        })
        res.render("index", { title: "All my Blogs", blogs: data})
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

const blog_edit_get = (req, res) => {
    Blog.findById(req.params.id)
    .then((data) => {
        res.render("edit", { title: "Editor", blog: data })
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_edit_post = (req, res) => {
    Blog.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((data) => {
        res.redirect(`/blogs/${data._id}`)
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_signin_get = (req, res) => {
    res.render("signin", { title: "Sign In" })
}

module.exports = {
    blog_index,
    blog_post,
    blog_create_get,
    blog_create_post,
    blog_delete,
    blog_edit_get,
    blog_edit_post,
    blog_signin_get
}