import express from "express"
import fetch from "node-fetch"
import cors from "express"

const app = express()

app.use(cors())

app.get("/weather", async (req, res) => {
    const { city, state } = req.query

    if (!city || !state) {
        return res.status(400).json({
            ok: false,
            error: "Missing city and/or state"
        })
    }

    const query = `${city}`
    const geocodeURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&country=US`

    const geoRes = await fetch(geocodeURL)
    const geoData = await geoRes.json()

    if (!geoData.results || geoData.results.length === 0) {
        return res.status(404).json({
            error: "Location not found."
        })
    }

    const loc = geoData.results.find(r => r.admin1 === state)

    const { latitude, longitude } = loc

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;

    const weatherRes = await fetch(url);
    const weatherData = await weatherRes.json();

    return res.status(200).json({
        temperature: weatherData.current.temperature_2m,
        wind: weatherData.current.wind_speed_10m,
        raw: weatherData
    })
})

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})