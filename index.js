const express = require("express")
const app = express()
const path = require("path")

const PORT = process.env.PORT || 3000

var subscribers = []
const messages = []

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get("/chat", (req, res) => {
    if (messages.length == 0 || req.query.last == messages[messages.length - 1].id || req.query.last == -1) {
        subscribers.push(res)
    } else {
        const toSend = messages.filter(e => e.id > req.query.last)
        res.send(toSend)
    }
})

app.post("/chat", (req, res) => {
    res.send("OK")
    const msg = { id: messages.length, message: req.body }
    messages.push(msg)
    if (messages.length > 100) messages.shift()
    subscribers.forEach(sub => {
        sub.send([msg])
    })
    subscribers = []
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.listen(PORT, () => { console.log("Started on", PORT) })
