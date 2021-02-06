require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./phonebookMongo')  // imports all code from "./mongo.js" required to make "Note"

let persons = []
const updateFromDB = async () => {
  Person.find({})
    .then(result => {
      persons = result
    })
    .catch(err => {
      console.log('Error updating from DB', err)
    })
}
updateFromDB();

// Express server starts here
app.use(cors())
app.use(express.json())
app.use(morgan(function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.status(req, res),
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use((req, res, next) => {
  console.log(`📣 START ~`)
  next()
  console.log(`📣 STOP ~`)
})

app.get ('/', (req, res) => {
  console.log(`📣 Welcome! ~`)
  res.send('<h1>Welcome home.</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(result => {
      persons = result
      res.json(result)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = String(req.params.id)
  // const person = persons.find(ele => ele.id === id)
  // if (!person) {
  //   return res.status(404).end('Nothing here but us chickens.')
  // }
  // res.json(person)

  // Updated version with Error handling
  Person.findById(id)
    .then(person => res.json(person))
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
  res.send(
    `<p>The phonebook has info on ${persons.length} people</p>
    <p>${new Date}</p>`
    )
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  // Check for missing content or duplicate names
  const namesArr = persons.map(ele => ele.name.toLowerCase())
  if (body.content === undefined) {
    return res.status(400).json({ error: 'missing content' })
  } else if (!body.name || !body.number) {
    return res.status(422).json({ error: 'missing name and/or number'})
  } else if (namesArr.includes(body.name.toLowerCase())) {
    return res.status(422).json({error: 'name already exists'})
  }
  // Post to Mongo database
  person.save()
    .then(person => {
      res.json(person)
      updateFromDB()
    })
})

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const body = req.body
  Person.findByIdAndUpdate(id, { number: body.number }, {new: true})
    .then(data => res.json(data))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.deleteOne({ _id: id })
    .then(data => console.log(`📣 Deleted Count:`, data.deletedCount))
})

// catches all unknown requests
const unknownEndpoint = (req, res) => {
  return res.status(404).end('404 - Unknown Endpoint :(')
}
app.use(unknownEndpoint)

// error handling
const errorHandler = (err, req, res, next) => {
  console.log(`📣 ERROR ~`, err.message)
  
  if (err.name === 'CastError') {
    return res.status(400).send({error: 'ID does not exist'})
  }
  next(err) // calls next(err) if uncaught by above if statement
}
app.use(errorHandler)

// catches all uncaught errors
function errorHandlerFinal (err, req, res, next) {
  res.status(500)
  res.json({ error: 'bad request'})
}
app.use(errorHandlerFinal)


const PORT = process.env.EXPRESS_PORT
app.listen(PORT, () => {
  console.log('📣 Server running on port', PORT)
  console.log('Connecting to MongoDB, please wait...')
})