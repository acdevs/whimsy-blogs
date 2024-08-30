import express from 'express'

const router = express.Router()

router.get("/", (req, res) => {
    res.redirect("/blogs")
})

router.get("/about", (req, res) => {
    res.render("about", { title: "About" })
})

import { user_profile_get } from '../controllers/user.controllers.js'
router.get("/@:username", user_profile_get)

export default router