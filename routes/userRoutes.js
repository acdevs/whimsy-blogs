const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/requireAuth')

const { 
    user_signin_post,
    user_signup_post,
    user_signout_get,
    user_profile_get
} = require('../controllers/userControllers')

router.use(requireAuth)

router.get("/profile", user_profile_get)

router.post("/signin", user_signin_post)

router.post("/signup", user_signup_post)

router.get("/signout", user_signout_get)

module.exports = router