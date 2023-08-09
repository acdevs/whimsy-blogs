const express = require('express')
const router = express.Router()
const { 
    blog_index,
    blog_post,
    blog_create_get,
    blog_create_post,
    blog_delete
} = require('../controllers/blogControllers')


router.get("/", blog_index)

router.get("/create", blog_create_get)

router.post("/", blog_create_post)

router.get("/:id", blog_post)

router.delete('/:id', blog_delete);

module.exports = router