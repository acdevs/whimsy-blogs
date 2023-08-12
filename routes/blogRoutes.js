const express = require('express')
const router = express.Router()
const { 
    blog_index,
    blog_post,
    blog_create_get,
    blog_create_post,
    blog_delete,
    blog_edit_get,
    blog_edit_post,
    blog_signin_get
} = require('../controllers/blogControllers')


router.get("/", blog_index)

router.get("/create", blog_create_get)

router.get("/signin", blog_signin_get)

router.post("/", blog_create_post)

router.get("/:id", blog_post)

router.delete('/:id', blog_delete)

router.get('/edit/:id', blog_edit_get)

router.post("/edit", blog_edit_post)


module.exports = router