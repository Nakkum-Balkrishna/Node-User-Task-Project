// MONGODB_URL=mongodb://127.0.0.1:27017/task-manager-api
// task-manager-api this will be the name of our database
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL)