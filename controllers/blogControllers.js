const dateFns = require("date-fns")
const readingTime = require('reading-time')
const Blog = require("../models/blog")

const perPage = 10

const blog_index = (req, res) => {
    const page = req.query.p || 1
    
    Blog.find()
    .sort({ createdAt: -1 })
    .skip(page * perPage - perPage)
    .limit(perPage)
    .then( async (data) => {
        data.forEach((blog) => {
            blog.timestamp = dateFns.formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })
            blog.readingTime = readingTime(blog.body).text
        })
        
        const count = await Blog.count({});
        const pageCount = Math.ceil(count / perPage);
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;
        const hasNextPage = nextPage <= pageCount;
        const hasPrevPage = prevPage >= 1;

        res.render("index", { 
            title: "Latest Blogs", 
            blogs: data,
            currentPage: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: hasPrevPage ? prevPage : null,
            res: {
                user : req.user,
            }
        })
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_about_get = (req, res) => {
    res.render("about", { 
        title: "About", 
        res: {
            user : req.user,
        }
    })
}

const blog_post = (req, res) => {
    Blog.findById(req.params.id)
    .then((data) => {
        if(!req.user){
            res.render("posts", { 
                title: "Blog Post", 
                blog: data, 
                res: {
                    user : null, 
                    isAuthor : null
                } 
            })
            return
        }
        let isAuthor = false;
        if(req.user._id.toString() == data.author.id.toString()) isAuthor = true;
        res.render("posts", { 
            title: "Blog Post", 
            blog: data, 
            res: {
                user : req.user, 
                isAuthor : isAuthor
            } 
        })
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_create_get = (req, res) => {
    if( !req.user ){
        res.redirect("/blogs/signin")
        return
    }
    res.render("create", { 
        title: "Create a new blog",
        res: {
            user : req.user,
        }
    })
}

const blog_create_post = (req, res) => {
    const {title, snippet, body} = req.body
    const blog = new Blog({ title, snippet, body, 'author.id' : req.user._id, 'author.alias' : req.user.alias })
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
    .then(data => {
        if( !req.user || req.user._id.toString() != data.author.id.toString() ){
            res.redirect("/blogs/signin")
            return
        }
        res.json({ redirect: "/blogs" })
    })
    .catch(err => {
        console.log(err)
        res.status(404).render("404", { title: "404" })
    });
}

const blog_edit_get = (req, res) => {
    Blog.findById(req.params.id)
    .then((data) => {
        if( !req.user || req.user._id.toString() != data.author.id.toString() ){
            res.redirect("/blogs/signin")
            return
        }
        res.render("edit", { 
            title: "Editor", 
            blog: data,
            res: {
                user : req.user,
            }
        })
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_edit_post = (req, res) => {
    Blog.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((data) => {
        if( !req.user || req.user._id.toString() != data.author.id.toString() ){
            res.redirect("/blogs/signin")
            return
        }
        res.redirect(`/blogs/${data._id}`)
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_search_post = async (req, res) => {
    const page = req.query.p || 1
    const searchTerm = req.body.search
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const matchCount = await Blog.find({
            $text: { $search: searchNoSpecialChar }
        }).count({})
          
    Blog.find({
        $or: [
            { title: { $regex: searchNoSpecialChar, $options: "i" } },
            { snippet: { $regex: searchNoSpecialChar, $options: "i" } },
            { body: { $regex: searchNoSpecialChar, $options: "i" } }
        ],
            $text: { $search: searchNoSpecialChar }
        },
        { score: { $meta: "textScore" } 
    })
    .sort({ score: { $meta: "textScore" }, posts: -1 })
    .skip(page * perPage - perPage)
    .limit(perPage)
    .then((data) => {
        data.forEach(async (blog) => {
            blog.timestamp = dateFns.formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })
            blog.readingTime = readingTime(blog.body).text
        })

        const pageCount = Math.ceil(matchCount / perPage);
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;
        const hasNextPage = nextPage <= pageCount;
        const hasPrevPage = prevPage >= 1;

        res.render("search", { 
            title: "Search Results", 
            blogs: data, 
            currentPage: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: hasPrevPage ? prevPage : null,
            searchTerm,
            matchCount,
            res: {
                user : req.user,
            }
        })
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}

const blog_signin_get = (req, res) => {
    if( req.user ){
        res.redirect("/blogs/")
        return
    }
    res.render("signin", { 
        title: "Sign In", 
        error: { message : null },
        res: {
            user : req.user,
        }
    })
}

const blog_signup_get = (req, res) => {
    if( req.user ){
        res.redirect("/blogs/")
        return
    }
    res.render("signup", { 
        title: "Sign Up", 
        error: { message : null },
        res: {
            user : req.user,
        }
     })
}


module.exports = {
    blog_index,
    blog_about_get,
    blog_post,
    blog_create_get,
    blog_create_post,
    blog_delete,
    blog_edit_get,
    blog_edit_post,
    blog_search_post,
    blog_signin_get,
    blog_signup_get,
}