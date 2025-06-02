console.log('Hier komt je server voor Sprint 12.')
//express downloaden
import express from 'express'

const app = express()

//public map
app.use(express.static('public'))

//laat data beter ophalen
app.use(express.urlencoded({extended: true}))





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