const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOneID, userOne, userTwo, userTwoID, setupDatabase, taskOneId} = require('../tests/fixtures/db') 

beforeEach(setupDatabase)

test('Should create task for user', async ()=>{
    const res = await request(app)
                    .post('/tasks')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send({
                        description: 'First Task'
                    })
                    .expect(201)
                
    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)

})

test('Get all the tasks for a user', async ()=>{
    const res = await request(app)
                    .get('/tasks')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200)
    expect(res.body.length).toEqual(2)
})

test('Delete different user tasks', async () =>{
    const res = await request(app)
                    .delete(`/tasks/${taskOneId}`)
                    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                    .send()
                    .expect(400)
    
    const check = await Task.findById(taskOneId)
    expect(check).not.toBeNull()
})