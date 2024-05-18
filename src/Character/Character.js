export const Character = (character) => {
  return `
  <div class="character">
    <img class= "img" src="${character.charImg}"/>
    <h3 class="name">${character.name}</h3>
   
    <div class="tooltip">
      <p class="paragraph tooltip">
        ${character.charDescrip}
      </p>
       <span class="tooltiptext">${character.charDescrip}</span>
     </div>
      

  </div>`
}
