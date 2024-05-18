const puppeteer = require('puppeteer')
const fs = require('fs')

const starWarsSchar = []

const scrapper = async (url) => {
  const browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage()
  await page.goto(url)
  await page.setViewport({ width: 1080, height: 1024 })

  repeat(page, browser)
  console.log(starWarsSchar)
}

const repeat = async (page, browser) => {
  // crear archivo json para guardar la info de las URL recuperadas
  createJsonFile('charactersLink.json')
  createJsonFile('failedLink.json')
  createJsonFile('charactersInfo.json')
  // Personajes que hay desde el inicio
  const characters = await page.$$('.building-block-config')
  console.log(`existen ${characters.length} chracters`)

  /* obtener el contenedor del boton "show more"*/
  const btnContainer = await page.$$('.show_more_container')
  console.log('Hay mas ', btnContainer.length)

  let tries = 0
  let curretCharsAmount = 0
  let linksArray = []
  let failedLinks = []
  /* iterar sobre el botón de "show more" hasta que se hayan cargado todos los personajes */
  while (true) {
    const section = await page.$$('.has_more')
    if (section) {
      console.log('still more. Clicking again')
      await btnContainer[0].$eval('.show_more', (el) => el.click())

      /* comprobar el número de personajes */
      const charactersAfter = await page.$$('.building-block-config')
      console.log(`current chars amout is ${charactersAfter.lenght}`)
      if (charactersAfter.length !== curretCharsAmount) {
        tries = 0
        curretCharsAmount = charactersAfter.length
        console.log(
          'O es primera iteracion o el numero de personajes ha cambiado'
        )
        console.log(
          `Despues de hacer click existen ${curretCharsAmount} chracters`
        )
      } else {
        console.log(
          `El numero de personajes se ha mantenido en ${curretCharsAmount}`
        )
        tries++
        console.log(`El numero de tries es ${tries}`)
      }
      /* para al llegar al final del scrooll infinito */
      if (tries === 10) {
        console.log('Limite de tries alcanzado. Se termina la iteracion')

        /* almacenar toods los personajes consultados */
        for (let i = 0; i < charactersAfter.length; i++) {
          const linkObj = await getCharLink(charactersAfter[i])
          linksArray.push(linkObj)
        }

        break
      }
    } else {
      console.log('Ya no hay mas')
      hasMore = false
    }
  }
  console.log('Fuera del while')
  let counter = 0
  for (let link of linksArray) {
    console.log(`already ${counter} of ${linksArray.length} harvested!`)
    writeLink(link, 'charactersLink.json')
    counter++
    /* navegar a la página de descripción */
    try {
      const charObj = await go2CharPage(link.i, browser)
      // starWarsSchar.push(charObj)
    } catch (error) {
      console.log(`Ha ocurrido ${error}`)
      writeLink(link, 'failedLink.json')
      failedLinks.push(link)
    }
  }

  console.log('writted')
  /* cerrar el browser */
  await browser.close()
}

scrapper('https://www.starwars.com/databank')

const getCharLink = async (character) => {
  const element = await character.$eval('a[href]', (a) => a.href)
  // const link = element.$eval('a[href]', (a) => a.href)
  const linkObj = { i: element }
  return linkObj
}
const createJsonFile = (name) => {
  if (fs.existsSync(name)) {
    console.log('file already exists')
  } else {
    let list = []
    let listString = JSON.stringify(list, null, 4)
    fs.writeFile(name, listString, 'utf8', (err) => {
      if (err) {
        console.error('Erorr al escribir', err)
      } else {
        console.log('writted!')
      }
    })
  }
}
const writeLink = (obj, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo', err)
      return
    }
    let jsonData
    try {
      jsonData = JSON.parse(data)
    } catch (error) {
      console.error('Error al parsear JSON:', error)
    }
    if (!Array.isArray(jsonData)) {
      console.error('El contenido del archivo JSON no es una lista.')
      return
    }
    // Añadir el nuevo objeto a la lista
    // jsonData.push(obj)
    ///////////////
    let savedSlinks = []
    for (let info of jsonData) {
      savedSlinks.push(info.charImg)
    }
    if (!savedSlinks.includes(obj.charImg)) {
      jsonData.push(obj)
      const jsonString = JSON.stringify(jsonData, null, 4)

      // Escribir la lista actualizada en el archivo JSON
      fs.writeFile(file, jsonString, 'utf8', (err) => {
        if (err) {
          console.error('Error escribiendo el archivo:', err)
        } else {
          console.log(`Archivo ${file} actualizado correctamente.`)
        }
      })
    } else {
      console.log('charImg already exists')
    }

    // Convertir la lista actualizada de nuevo a JSON
    // const jsonString = JSON.stringify(jsonData, null, 4)

    // // Escribir la lista actualizada en el archivo JSON
    // fs.writeFile(file, jsonString, 'utf8', (err) => {
    //   if (err) {
    //     console.error('Error escribiendo el archivo:', err)
    //   } else {
    //     console.log('Archivo JSON actualizado correctamente.')
    //   }
    // })
  })
}
const go2CharPage = async (characterLink, browser) => {
  try {
    let descriptionPage = await browser.newPage()
    descriptionPage.goto(characterLink, {
      timeout: 60000 /*waitUntil: 'domcontentloaded'*/
    })
    await descriptionPage.waitForNavigation()
    //* obtener la imagen
    let charObj = await createCharObj(descriptionPage)

    /* cerrar ventana del personaje */
    await descriptionPage.close()
    writeLink(charObj, 'charactersInfo.json')
    return charObj
  } catch (error) {
    console.log(`Error going to character page: ${error}`)
  }
}
const createCharObj = async (descriptionPage) => {
  try {
    /*obtener los datos */
    let charImgContainer = await descriptionPage.$$('.featured_single')

    /* char name */
    let charName = await charImgContainer[0].$eval('img[alt]', (el) => el.alt)
    console.log(`Character name is: ${charName}`)
    /* char img */
    let charImg = await charImgContainer[0].$eval('img[data-src]', (el) =>
      el.getAttribute('data-src')
    )
    console.log(`image path is: ${charImg}`)

    // /* char Description */

    let charDesc = await charImgContainer[0].$eval(
      '.desc',
      (el) => el.textContent
    )
    console.log(`character description is: ${charDesc}`)
    let charObj = { name: charName, charDescrip: charDesc, charImg: charImg }

    /* retornar */
    return charObj
  } catch (error) {
    console.log(
      `Error scrapping character params or creating charObj, ${error}`
    )
  }
}
