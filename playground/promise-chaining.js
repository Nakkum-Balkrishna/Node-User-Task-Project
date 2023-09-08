require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('647f7235768e1bad9c664b5c', {age: 1}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age:1})
// }).then((result)=>{
//     console.log(result);

// }).catch((e)=>{
//     console.log(e);
// })

const updateAndCount = async (id, age) => {
    const task = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count;
}

updateAndCount('647f7235768e1bad9c664b5c', 27).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})