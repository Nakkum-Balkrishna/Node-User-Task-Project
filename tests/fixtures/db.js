const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneID = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneID,
    name: 'krishna',
    email: 'krishna@example.com',
    password: 'myPass@123!!',
    tokens: [{
        token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
    }]
}

const userTwoID = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoID,
    name: 'krishna2',
    email: 'krishna2@example.com',
    password: 'myPass2@123!!',
    tokens: [{
        token: jwt.sign({_id: userTwoID}, process.env.JWT_SECRET)
    }]
}

const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
    _id: taskOneId,
    description: 'My new task',
    completed: false,
    owner: userOneID
}


const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'My second task',
    completed: true,
    owner: userOneID
}


const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'My third task',
    completed: false,
    owner: userTwoID
}

const setupDatabase = async () =>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = {
    userOneID, 
    userOne, 
    userTwo,
    userTwoID,
    setupDatabase,
    taskOneId
}