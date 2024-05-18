export const charactersRequest = async () => {
  /* endpoint, page */
  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/characters`
    ) /* ${endpoint}/?=${page} */
    const characters = await res.json()
    // dataToFront(characters)
    console.log('inserting')
    return characters
  } catch (error) {}
}
// module.exports = { charactersRequest }
