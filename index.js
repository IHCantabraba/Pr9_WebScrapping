const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { connectToDB } = require('./src/config/db')
const charactersRouter = require('./src/api/router/characters')
const PORT = 3000

const app = express()
app.use(express.json())
connectToDB()
app.use(cors())

app.use('/api/v1/characters', charactersRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found')
})

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`)
})
