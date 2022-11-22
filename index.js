const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid') // biblioteca que cria vários id diferentes (npm i uuid)
const port = 3000
const app = express()
app.use(express.json())

// - GET => Buscar informação no back-end

const users = []

// Middlewares -> é um interceptador, tem o poder de parar completamente ou aterar um dado.

// é uma função

const checkUserId = (request, response, next) => {
  const { id } = request.params

  const index = users.findIndex(user => user.id === id)
  if (index < 0) {
    return response.status(404).json({ message: 'User not found' })
  }

  request.userIndex = index
  request.userId = id

  next()
  //Para que o fluxo das rotas continue tem que chamar o next.
}

app.get('/users', (request, response) => {
  return response.json(users)
})

app.post('/users', (request, response) => {
  const { name, age } = request.body

  const user = { id: uuid.v4(), name, age }

  users.push(user)

  return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response) => {
  const { name, age } = request.body
  const index = request.userIndex
  const id = request.userId
  const updatedUser = { id, name, age }

  users[index] = updatedUser
  return response.json(updatedUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
  const index = request.userIndex
  users.splice(index, 1)

  return response.status(204).json()
})

app.listen(port, () => {
  console.log(`🚀 Server started on ${port}`)
})
