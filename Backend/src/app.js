const express = require("express")
const app = express()
const dealerRouter = require("./router/dealer.route")
const auth = require("./router/auth.route")
app.use(express.json())

app.use("/api/auth", auth)

app.use("/api/dealer", dealerRouter)
module.exports  = app