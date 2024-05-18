import { charactersRequest } from '../utils/characterRequest.js'
import { Character } from '../Character/Character.js'
import { Pagination } from '../paginantion/pagination.js'

export const dataToFront = async () => {
  const characters = await charactersRequest()
  /* divide all characters in chuncks de 24 */

  let i = 0
  let page = 1
  let charcaterPage = {
    page: page,
    component: dataToFront
  }
  for (let character of characters) {
    i++
    if (i < 25) {
      const section = document.querySelector('.section')
      section.innerHTML += Character(character)
      if (!document.querySelector('.ShowMore')) {
        document.body.append(Pagination(charcaterPage))
      }
      if (section.childElementCount === 2295) {
        const btn = document.querySelector('.pagination')
        btn.classList.add('hide')
      }
    } else {
      page++
      i === 0
    }
  }
}

// const chunk = (array, chunk_size) => {
//   if (array.length == 0) {
//     return []
//   } else {
//     const charcatersPageInfo = [array.splice(0, chunk_size)].concat(
//       chunk(array, chunk_size)
//     )

//     return charcatersPageInfo
//   }
// }
// module.exports = { dataToFront }
