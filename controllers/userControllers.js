const User = require("../models/user")
const Blog = require("../models/blog")
const dateFns = require("date-fns")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const user_profile_get = (req, res) => {
    if( !req.user ){
        res.redirect("/blogs/signin")
        return
    }

    const perPage = 10
    const page = req.query.p || 1
    
    Blog.find({ 'author.id' : req.user._id})
    .sort({ createdAt: -1 })
    .skip(page * perPage - perPage)
    .limit(perPage)
    .then( async (data) => {
        data.forEach((blog) => {
            blog.timestamp = dateFns.formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })
        })
        
        const count = await Blog.count({});
        const pageCount = Math.ceil(count / perPage);
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;
        const hasNextPage = nextPage <= pageCount;
        const hasPrevPage = prevPage >= 1;

        res.render("profile", {
            title: "All my Blogs", 
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

const user_signup_post = (req, res) => {
    if( req.user ){
        res.redirect("/blogs/")
        return
    }
    const {alias, email, password} = req.body

    User.findOne({email})
        .then((user) => {
            console.log(user)
            if(user) {
                res.render("signup", { 
                    title: "Sign Up", 
                    error: {
                        message : "Your email is already registered."
                    },
                    res: {
                        user : req.user,
                    }
                })
                return
            }
            const hashedPassword = bcrypt.hashSync(password, 10)
            const userm = new User({
                alias,
                email,
                password: hashedPassword
            })
            userm.save()
            .then((user) => {
                const token = jwt.sign({id: user._id}, process.env.SESSION_SECRET)
                res.cookie('user_session_token', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24})
                res.redirect("/blogs")
            })
        })
        .catch((err) => {
            res.status(404).render("404", { title: "404" })
        })
}


const user_signin_post = (req, res) => {
    if( req.user ){
        res.redirect("/blogs/")
        return
    }
    const {email, password} = req.body

    User.findOne({email})
    .then((user) => {
        if(!user) {
            res.render("signin", { 
                title: "Sign In", 
                error: {
                    message : "Your email is not registered yet."
                },
                res: {
                    user : req.user,
                }
            })
            return
        }
        const isPasswordCorrect = bcrypt.compareSync(password, user.password)
        if(!isPasswordCorrect) {
            res.render("signin", { 
                title: "Sign In", 
                error: {
                    message : "Probably you forgot your passphrase."
                },
                res: {
                    user : req.user,
                }
            })
            return
        }
        const token = jwt.sign({id: user._id}, process.env.SESSION_SECRET)
        res.cookie('user_session_token', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24})
        res.redirect("/blogs")
    })
    .catch((err) => {
        res.status(404).render("404", { title: "404" })
    })
}


const user_signout_get = (req, res) => {
    res.clearCookie("user_session_token")
    res.redirect("/blogs/")
}

module.exports = {
    user_signin_post,
    user_signup_post,
    user_signout_get,
    user_profile_get
}