console.log('Hier komt je server voor Sprint 12.')
//express downloaden
import express from 'express'

import { Liquid } from 'liquidjs';

const app = express()


//api's
const api_url = "https://labelvier.nl/wp-json"

const api_cases = "/wp/v2/cases?per_page=99"

//hier komen de fetches
const CasesResponse = await fetch(`${api_url}${api_cases}`)


//hier word de data opgehaald en vertaald in JSON
const CasesResponseJSON = await CasesResponse.json()

console.log(CasesResponseJSON)

//public map
app.use(express.static('public'))

// Liquid instellen als 'view engine' (dus de html mapjes die de website te zien krijgen)
const engine = new Liquid();
app.engine('liquid', engine.express()); 

//laat data beter ophalen
app.use(express.urlencoded({extended: true}))

//cases.liquid 
app.get('/', async function (request, response) {

  const CasesResponse = await fetch(`${api_url}${api_cases}`)

  const CasesResponseJSON = await CasesResponse.json()
   
   response.render('cases.liquid', {CasesResponse: CasesResponseJSON.data})
})

//detail pagina
app.get('/project/:id', async function (request, response) {
   
   response.render('detail.liquid',)
})


//redirect naar homepage als pagina niet werkt
app.post('/', async function (request, response) {
 
  response.redirect(303, '/')
})

//nummer van localhost
app.set('port', process.env.PORT || 8000)

//foutmelding 
app.listen(app.get('port'), function () {
  
  console.log(`Application started on http://localhost:${app.get('port')}`)
})