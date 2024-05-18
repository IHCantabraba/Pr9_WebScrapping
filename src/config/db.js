const mongoose = require('mongoose')

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log(`Successfully connected to DB 😉`)
  } catch (error) {
    console.log(`An error occurred while connecting to db: ${error}`)
  }
}

module.exports = { connectToDB }
