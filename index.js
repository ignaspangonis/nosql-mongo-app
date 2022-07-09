import bodyParser from 'body-parser'
import express from 'express'

import * as api from './api.js'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

console.log('Connecting to MongoDB...')
try {
  await api.connect()
  console.log('Connected to the MongoDB database')
} catch (error) {
  console.log(`Connection error: ${error.message}`)
}

app.post('/user', async function (req, res, next) {
  try {
    const response = await api.createUser({
      name: req.body.name,
      birthDate: req.body.birthDate,
      wallet: {
        amount: req.body.wallet?.amount || 0,
      },
    })
    res.send(response)
  } catch (error) {
    next(error.message)
  }
})

app.post('/item', async function (req, res, next) {
  try {
    const response = await api.createItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      ownerId: req.body.ownerId,
    })
    res.send(response)
  } catch (error) {
    next(error.message)
  }
})

app.get('/users', async function (req, res, next) {
  try {
    const users = await api.getAllUsers()
    res.send(users)
  } catch (error) {
    next(error.message)
  }
})

app.get('/items', async function (req, res, next) {
  try {
    const items = await api.getAllItems()
    res.send(items)
  } catch (error) {
    next(error.message)
  }
})

app.delete('/users', async function (req, res, next) {
  try {
    const response = await api.deleteAllUsers()
    res.send(response)
  } catch (error) {
    next(error.message)
  }
})

app.delete('/user/:id', async function (req, res, next) {
  try {
    const response = await api.deleteUser(req.params.id)
    res.send(response)
  } catch (error) {
    next(error.message)
  }
})

/**
 * 1) Parašyti užklausą įdėtinėms (angl. embedded) esybėms gauti (banko pavyzdžiu - visas, visų klientų sąskaitas).
 * Užklausa grąžina visas naudotojo, kurio id yra parametro reikšmė, prekes.
 */
app.get('/user/:id/items', async function (req, res, next) {
  try {
    const items = await api.getUserItems(req.params.id)
    res.send(items)
  } catch (error) {
    next(error.message)
  }
})

/**
 * 2) Parašyti bent vieną agreguojančią užklausą (banko pavyzdžiu - visų klientų balansus)
 * Užklausa grąžina visų prekių kainų vidurkį.
 */
app.get('/items/avg-price', async function (req, res, next) {
  try {
    const response = await api.getAverageItemsPrice()
    res.send(response)
  } catch (error) {
    next(error.message)
  }
})

/**
 * 3) Parašyti tą pačią agreguojančią užklausą (kaip #2) su map-reduce
 * https://mongoosejs.com/docs/api.html#model_Model-mapReduce
 */
app.get('/items/avg-price-map-reduce', async function (req, res, next) {
  try {
    const response = await api.getAverageItemsPriceMapReduce()
    res.send(response)
  } catch (error) {
    next(error.message)
  }
})

app.listen(8000, function () {
  console.log('Serving app on port 8000')
})
