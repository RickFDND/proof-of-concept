console.log('Hier komt je server voor Sprint 12.')
//express downloaden
import express from 'express'

import { Liquid } from 'liquidjs';

const app = express()


//api's
const api_url = "https://labelvier.nl/wp-json"

const api_cases = "/wp/v2/cases"

const api_users = "/wp/v2/users"


//public map
app.use(express.static('public'));

// Liquid instellen als 'view engine' (dus de html mapjes die de website te zien krijgen)
const engine = new Liquid();
app.engine('liquid', engine.express()); 

//laat data beter ophalen
app.use(express.urlencoded({extended: true}))


//cases.liquid 
app.get(['/cases', '/cases/page:page'], async (req, res) => {
  const page = req.params.page || 1;

  const url = `${api_url}${api_cases}?_embed&per_page=8&page=${page}`;

  const responseAPI = await fetch(url);
  
  const data = await responseAPI.json();

  const totalPages = responseAPI.headers.get('X-WP-TotalPages');

  res.render('cases.liquid', {
    cases: data,
    currentPage: Number(page),
    totalPages: Number(totalPages)
  });
});


//detail pagina
app.get('/project/:id', async function (request, response) {

  const ProjectResponse = await fetch(`${api_url}${api_cases}/${request.params.id}`);

  const ProjectResponseJSON = await ProjectResponse.json();

  const usersResponse = await fetch(`${api_url}${api_users}/`);

  const usersResponseJSON = await usersResponse.json();

   
   response.render('detail.liquid', {project: ProjectResponseJSON, users: usersResponseJSON});
})

//POST nieuwsbrief

app.post("/nieuwsbrief", async function (req, res) {
  const emailAdres = req.body.email;

  const inschrijving = {
    from: "nieuwsbrief",
    for: emailAdres,
    text: "Nieuwe aanmelding!"
  };

  await fetch("https://fdnd-agency.directus.app/items/avl_messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(inschrijving)
  });

  res.redirect(303, "/cases");
});

//redirect naar homepage als pagina niet werkt
app.post('/', async function (request, response) {
 
  response.redirect(303, '/cases')
})

//nummer van localhost
app.set('port', process.env.PORT || 8000)

//foutmelding 
app.listen(app.get('port'), function () {
  
  console.log(`Application started on http://localhost:${app.get('port')}`)
})