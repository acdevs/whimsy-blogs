import dateFns from "date-fns"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import Blog from "../models/blog.model.js"

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

        res.render("./users/profile", {
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
    const {fullName, email, password} = req.body

    User.findOne({email})
        .then((user) => {
            if(user) {
                res.render("./auths/signup", { 
                    title: "Sign Up", 
                    error: {
                        message : "You've already registered."
                    },
                    res: {
                        user : req.user,
                    }
                })
                return
            }
            const hashedPassword = bcrypt.hashSync(password, 10)
            const salt = Math.floor(Math.random() * 999) + 1;
            const username = email.substring(0, email.indexOf('@')).replace(/[._]/g, "-").toLowerCase() + "-" + salt;
            const userObj = new User({
                username,
                fullName,
                email,
                password: hashedPassword
            })
            userObj.save()
            .then((user) => {
                const token = jwt.sign({id: user._id}, process.env.SESSION_SECRET)
                res.cookie('user_session_token', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24})
                res.redirect("/blogs")
            })
            .catch((err) => {
                res.render("./auths/signup", { 
                    title: "Sign Up", 
                    error: {
                        message : "Something went wrong."
                    },
                    res: {
                        user : req.user,
                    }
                })
            })
        })
        .catch((err) => {
            res.status(404).render("404", { title: "404" })
            console.log(err)
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
            res.render("./auths/signin", { 
                title: "Sign In", 
                error: {
                    message : "You've not registered yet."
                },
                res: {
                    user : req.user,
                }
            })
            return
        }
        const isPasswordCorrect = bcrypt.compareSync(password, user.password)
        if(!isPasswordCorrect) {
            res.render("./auths/signin", { 
                title: "Sign In", 
                error: {
                    message : "You've got invalid credentials."
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

export {
    user_signin_post,
    user_signup_post,
    user_signout_get,
    user_profile_get
}