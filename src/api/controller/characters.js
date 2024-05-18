const Character = require('../model/characters')
const characterInfo = require('../../../charactersInfo.json')

const insertAllCharacters = async (req, res, next) => {
  try {
    await Character.insertMany(characterInfo)
    return res.status(200).json(`All characters saved correctly 😃`)
  } catch (error) {
    return res.status(400).json(`Error while inserting character: ${error}`)
  }
}

const getAllCharacters = async (req, res, next) => {
  try {
    const allCharacters = await Character.find()
    return res.status(200).json(allCharacters)
  } catch (error) {
    return res.status(400).json(`Error while getting characters: ${error}`)
  }
}
const deleteAllCharacters = async (req, res, next) => {
  try {
    await Character.deleteMany({})
    return res.status(200).json(`All registers deleted`)
  } catch (error) {
    return res.status(400).json(`Error while deleting characters: ${error}`)
  }
}
module.exports = { insertAllCharacters, getAllCharacters, deleteAllCharacters }
