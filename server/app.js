const express = require('express')
const path = require('path')
const { v4 } = require('uuid')
const { CONTACTS_URL } = require('./urls')

const app = express()
const PORT = 3000

const CONTACTS = [
  { id: v4(), name: 'Name1', value: 'value1', marked: false },
  { id: v4(), name: 'Name2', value: 'value2', marked: false },
  { id: v4(), name: 'Name3', value: 'value3', marked: false },
  { id: v4(), name: 'Name4', value: 'value4', marked: false },
  { id: v4(), name: 'Name5', value: 'value5', marked: false },
]

const defaultContact = () => ({
  id: v4(),
  name: '',
  value: '',
  marked: false,
})

app.use(express.json())

app.get(CONTACTS_URL, (req, res) => {
  debugger
  res.status(200).json(JSON.stringify(CONTACTS))
})

app.post(CONTACTS_URL, (req, res) => {
  debugger
  if (req.body) {
    const newContact = {
      ...defaultContact(),
      name: req.body.name,
      value: req.body.value,
      marked: req.body.marked,
    }
    CONTACTS.push(newContact)
    res.status(201).json(JSON.stringify(newContact))
  }
})

app.delete(`${CONTACTS_URL}/:id`, (req, res) => {
  debugger
  const id = req.params.id
  if (id) {
    const contactIndex = CONTACTS.findIndex((elem) => elem.id === id)
    CONTACTS.splice(contactIndex, 1)
    res.status(200)
  }
})

app.put(`${CONTACTS_URL}/:id`, (req, res) => {
  debugger
  const id = req.params.id
  if (id && req.body) {
    const contactIndex = CONTACTS.findIndex((elem) => elem.id === id)
    CONTACTS[contactIndex].name = req.body.name || CONTACTS[contactIndex].name
    CONTACTS[contactIndex].value =
      req.body.value || CONTACTS[contactIndex].value
    CONTACTS[contactIndex].marked =
      req.body.marked || CONTACTS[contactIndex].marked
    res.status(200).json(JSON.stringify(CONTACTS[contactIndex]))
  }
})

app.use(express.static(path.resolve(__dirname, '../client')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listen the ${PORT}`)
})
