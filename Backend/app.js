import express from "express"
import fetch from "node-fetch"
import cors from "express"

const app = express()

app.use(cors())

app.get("/weather", async (req, res) => {
    const { city, state } = req.query

    if (!city || !state) {
        res.status(400).json({
            ok: false,
            error: "Missing city and/or state"
        })
    }
})

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})