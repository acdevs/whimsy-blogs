const jwt = require("jsonwebtoken")
const User = require("../models/user")

const requireAuth = (req, res, next) => {

    const token = req.cookies.user_session_token
    if(!token){
        req.user = null
        next()
        return
    }
    jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
        if(err){
            req.user = null
            return
        }
        User.findById(decodedToken.id)
            .then((user) => {
                req.user = user
                next()
            })
            .catch((err) => {
                res.render("404", { title: "404" })
                return
            })
    })
    

}

module.exports = { requireAuth } 