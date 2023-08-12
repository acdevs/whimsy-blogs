require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const blogRoutes = require("./routes/blogRoutes")
const expressLayouts = require("express-ejs-layouts")

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

/* 404 page */
app.use((req, res) => {
    res.status(404).render("404", { title: "404" })
})