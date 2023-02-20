//const http = require('http')
//const { request, response } = require('express')
//function that is used to create an express application stored in the app variable
const { request, response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)


let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

/*const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type' : 'application/json'})
    response.end(JSON.stringify(notes))
})*/

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

//The first 'route' defines an event handler that is used to handle HTTP GET requests made to the application's / root
app.get('/',(request, response) => {
    response.send('<h1>Hello World</h1>')
})

/*app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})*/

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

//create a route for fetching a single resource
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  //const note = notes.find(note => {
    //console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    //return note.id === id
//})
  const note  = notes.find(note => note.id === id)
  console.log(note)

  if(note){
  response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})


//The second route defines an event handler that handles HTTP GET requests made to the notes path of the application
/*app.get('/api/notes', (request, response) => {
    response.json(notes)
})*/

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
//app.listen(PORT)
app.listen(PORT, () => {
  console.log(`Server runs on ${PORT}`)
})