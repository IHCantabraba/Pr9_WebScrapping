const {
  insertAllCharacters,
  getAllCharacters,
  deleteAllCharacters
} = require('../controller/characters')
const charactersRouter = require('express').Router()

charactersRouter.post('/insertData', insertAllCharacters)
charactersRouter.get('/', getAllCharacters)
charactersRouter.delete('/deleteAll', deleteAllCharacters)

module.exports = charactersRouter
