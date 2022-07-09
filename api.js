import mongoose from 'mongoose'

import User from './schema/User.js'
import Item from './schema/Item.js'

function logApiError(message) {
  console.log(`API error: ${message}`)
}

function logApiMessage(message) {
  console.log(`API message: ${message}`)
}

export function connect() {
  return mongoose.connect('mongodb://localhost:27017')
}

export function createUser(user) {
  return User.create(user)
}

export function getAllUsers() {
  return User.find()
}

export function getUserByName(name) {
  return User.findOne({ name })
}

export function getUserById(id) {
  return User.findById(id)
}

export function deleteAllUsers() {
  return User.deleteMany()
}

export function deleteUser(id) {
  return User.deleteOne({ _id: id })
}

export async function doesUserExist(id) {
  try {
    const user = await User.exists(id)
    logApiMessage('Found user', user)
    return user
  } catch (error) {
    logApiError(error.message)
  }
}

export function getAllItems() {
  return Item.find()
}

export function getUserItems(ownerId) {
  return Item.find({ ownerId })
}

export function deleteAllItems() {
  return Item.deleteMany()
}

export function getAverageItemsPrice() {
  return Item.aggregate([
    { $group: { _id: null, average: { $avg: '$price' } } },
  ])
}

export function createItem(item) {
  return Item.create(item)
}

export function getAverageItemsPriceMapReduce() {
  const o = {}
  o.map = function () {
    emit(null, this.price) // id is null because we want to get one result
  }
  // key parameter is the name of the group
  o.reduce = function (key, values) {
    return Array.sum(values) / values.length
  }

  return Item.mapReduce(o)
}
