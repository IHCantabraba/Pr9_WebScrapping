// import './pagination.css'
import { changePage } from '../utils/pages.js'
export const Pagination = (page) => {
  const divPagination = document.createElement('div')
  divPagination.className = 'pagination'

  const ShowMoreBtn = document.createElement('button')
  ShowMoreBtn.className = 'ShowMore'
  ShowMoreBtn.textContent = 'Show More'
  ShowMoreBtn.addEventListener('click', () => changePage('-', page))

  divPagination.append(ShowMoreBtn)

  return divPagination
}
