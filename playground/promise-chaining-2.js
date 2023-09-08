require('../src/db/mongoose');
const Task = require('../src/models/task')

// Task.findByIdAndRemove('647f63a0466217c3e8c7cbc6').then((task)=>{
//     console.log(task);
//     return Task.countDocuments({completed:false})
// }).then((task)=>{
//     console.log(task);
// }).catch((e)=>{
//     console.log(e);
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findOneAndRemove(id)
    const count = await Task.countDocuments({completed: true})
    return [count,task];
}

deleteTaskAndCount('64973345f0f07f3e566f6b34').then((res)=>{
    console.log(res);
}).catch((e)=>{
    console.log(e);
})