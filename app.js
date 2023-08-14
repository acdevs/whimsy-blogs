require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const blogRoutes = require("./routes/blogRoutes")
const userRoutes = require("./routes/userRoutes")
const expressLayouts = require("express-ejs-layouts")
const cookieParser = require("cookie-parser")
const MongoStore = require("connect-mongo")
const session = require("express-session")

const app = express()

/* mongoose */
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Connected & Server is running');
    })
})
.catch((err) => {
    console.log(err);
    return
})

/* middleware & static files*/
/*  -> logger */
app.use(morgan("dev"))
// app.use((req, res, next) => {
//     console.log("new request made:")
//     console.log("host: ", req.hostname)
//     console.log("path: ", req.path)
//     console.log("method: ", req.method)
//     next()
// })
/*  -> static files */
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true })) // parse url-encoded data
app.use(express.json()) // parse json data
app.use(cookieParser())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        collectionName: "sessions"
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}))

/* templating / view engine */
app.use(expressLayouts)
app.set('layout', 'layouts/main')
app.set('view engine', 'ejs')
app.set('views', 'views')


/* routes */
app.get("/", (req, res) => {
    // res.sendFile("./index.html", { root: __dirname })
    res.redirect("/blogs")
})

app.get("/about", (req, res) => {
    res.render("about", { title: "About" })
})

/* blog routes */
app.use('/blogs', blogRoutes)
app.use('/user', userRoutes)

/* 404 page */
app.use((req, res) => {
    res.status(404).render("404", { title: "404" })
})