const { response } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  {
    "name": "Dan",
    "number": "12345",
    "id": 1
  },
  {
    "name": "Robin",
    "number": "76556",
    "id": 2
  },
  {
    "name": "Mia",
    "number": "009887",
    "id": 3
  }
]
app.use(express.json())
app.use(morgan(function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.status(req, res),
    JSON.stringify(req.body)
  ].join(' ')
}))

app.get ('/', (req, res) => {
  res.send('<h1>Welcome home.</h1>')
})

app.get('/api/persons', cors(), (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(ele => ele.id === id)
  if (!person) {
    return res.status(404).end('Nothing here but us chickens.')
  }

  res.json(person)
})

app.get('/info', (req, res) => {
  res.send(
    `<p>The phonebook has info on ${persons.length} people</p>
    <p>${new Date}</p>`
    )
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000)
  }
  const namesArr = persons.map(ele => ele.name.toLowerCase())
  console.log('📣 names ~', namesArr)
  if (!body.name || !body.number) {
    return res.status(422).json({ error: 'missing content'})
  } else if (namesArr.includes(body.name.toLowerCase())) {
    return res.status(422).json({error: 'name already exists'})
  }
  persons = persons.concat(newPerson)
  res.json(persons)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(ele => ele.id !== id)
  res.status(200).json(persons)
  console.log('📣 persons ~', persons)
})

// catches all unknown requests
const unknownEndpoint = (req, res) => {
  return res.status(404).end('Nothing here, my dude...')
}
app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
  console.log('📣 Server running on port', PORT)
})