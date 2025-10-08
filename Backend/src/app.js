const express = require("express")
const app = express()
const dealerRouter = require("./router/dealer.route")
const auth = require("./router/auth.route")
const cors = require("cors")
app.use(express.json())


app.use(
  cors({
    origin: 'http://localhost:8081',
    credentials: true,
  })
)

app.use("/api/auth", auth)

// app.use("/api/admin", adminRouter)
app.use("/api/dealer", dealerRouter)
// app.use("/api/vendor", vendorRouter)

module.exports  = app