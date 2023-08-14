const express = require('express')
const { requireAuth } = require('../middleware/requireAuth')
const router = express.Router()

const { 
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
} = require('../controllers/blogControllers')

router.use(requireAuth)

router.get("/", blog_index)

router.get("/about", blog_about_get)

router.get("/signin", blog_signin_get)

router.get("/signup", blog_signup_get)

router.get("/create", blog_create_get)

router.post("/", blog_create_post)

router.get("/:id", blog_post)

router.delete('/:id', blog_delete)

router.get('/edit/:id', blog_edit_get)

router.post("/edit", blog_edit_post)

router.post("/search", blog_search_post)

module.exports = router