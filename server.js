const http = require("http")
const fs = require("fs")

const server = http.createServer((req, res) => {
    console.log(req.method, req.url)

    /* response */
    res.setHeader("Content-Type", "text/html")
    // res.write("<p>Hello, world!</p>")
    // res.end()

    /* routing */
    let path = "./pages"
    switch( req.url ){
        case "/":
            path += "index.html"
            res.statusCode = 200
            break
        case "/about":
            path += "about.html"
            res.statusCode = 200
            break
        /* redirects */
        case "/about-me":
            res.statusCode = 301
            res.setHeader("Location", "/about") // redirect to /about
            res.end() // end the response
        default:
            path += "404.html"
            res.statusCode = 404
    }

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err)
            res.end()
        } else {
            // res.write(data)
            res.end(data)
        }
    })
})

server.listen(3000, "localhost", () => {
    console.log("Listening for requests on port 3000")
})