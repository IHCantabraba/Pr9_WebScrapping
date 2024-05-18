const mongoose = require('mongoose')

const chracterSchema = mongoose.Schema(
  {
    name: { type: String, required: false, trim: true },
    charDescrip: { type: String, required: false, trim: true },
    charImg: { type: String, required: false, trim: true }
  },
  {
    timestamp: true,
    collection: 'characters'
  }
)
const Character = mongoose.model('characters', chracterSchema, 'characters')

module.exports = Character
