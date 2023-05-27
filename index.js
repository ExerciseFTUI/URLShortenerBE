const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const mainRoute = require('./routes/mainRoute')
const PORT = process.env.PORT || 5000
const app = express()


connectDB()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/', mainRoute)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})