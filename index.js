const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const ShortUrl = require('./models/shortUrl')
const PORT = process.env.PORT || 5000
const app = express()


connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    try {
        const shortUrls = await ShortUrl.find()
        res.status(200).json(shortUrls);
    } catch (err) {
        res.status(400).json(err);
    }
})

app.post('/shorten', async (req, res) => {
    try {
        const shortUrls = new ShortUrl({ full: req.body.fullUrl, short: req.body.shortUrl});
        await shortUrls.save();
        res.status(200).json(shortUrls);
    } catch (err) {
        res.status(404).json(err);
    }
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})