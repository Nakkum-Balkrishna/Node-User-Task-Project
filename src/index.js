const express = require("express");
require("./db/mongoose");
const userRouter = require("../src/routers/user");
const taskRouter = require("../src/routers/task");

const app = express();

port = process.env.PORT || 3000;

// app.use((req,res,next)=>{
//   res.status(503).send("Under maintainance please try back later.")
// })

// app.use((req,res,next)=>{
//   if(req.method === 'GET'){
//     res.send('GET requests are disabled')
//   }else{
//     next()
//   }
// })
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("App is listening of port " + port);
});


const Task = require('./models/task')
const User = require('./models/user')

// const main = async () =>{
//     const task = await Task.findById('64faf6e99f724bee61a6475f')
//     await task.populate('owner');
//     console.log(task.owner)

//     const user = await User.findById('64fb16e4281d64962a2aba04')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()

