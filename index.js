const express = require('express')
//const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.json());
app.use(cors())

/*morgan.token('data', function(req,res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms - :data')) */

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const getInfo = () => {
    const person = persons.length
    const now = new Date()
    return {"person":person, "now": now}
}

app.get('/info', (request,response) => {
    const info = getInfo()
    response.send(
        `<div>
            <p>Phonebook has info for ${info.person} people</p>
            <p>${info.now}</p>
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const nameExists = (name) => {
    return persons.some(person => person.name === name)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(nameExists(body.name)){
        return response.status(400).json({
            error: 'person already in phonebook'
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.ceil(Math.random()) * 999999
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})