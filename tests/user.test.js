const request = require('supertest') 
const app = require('../src/app')
const User = require('../src//models/user')
const { findById, findOneAndUpdate } = require('../src/models/task')
const {userOneID, userOne, setupDatabase} = require('../tests/fixtures/db') 

beforeEach(setupDatabase)

test('Should sign up user', async ()=>{
    const result = await request(app).post('/users').send({
        name: "krishna2",
        email: 'wassupquepasa@gmail.com',
        password: "ThisIsMyPass!",
    }).expect(201)
    const user = await User.findById(result.body.userData._id)
    
    // Test cases
    
    expect(user).not.toBeNull()
    
    expect(result.body.userData.name).toBe('krishna2')
    
    expect(result.body).toMatchObject({
        userData: {
            name: 'krishna2',
            email: 'wassupquepasa@gmail.com',
        },
        token: user.tokens[0].token 
    })

    expect(result.body.userData.password).not.toBe('ThisIsMyPass!')

})

test('Should login user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user_details = await User.findById(userOne._id)
    expect(user_details.email).toBe('krishna@example.com')
    expect(response.body).toMatchObject({
        user: {
            name: 'krishna',
            email: 'krishna@example.com'
        },
        token: user_details.tokens[1].token
    })

})

test('Should not login nonexisting user', async ()=>{
    await request(app).post('/users/login').send({
        email: 'exampl@gmail.com',
        password: 'weenfwfnfn'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('Should not get profile for non authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async ()=>{
    const response = await request(app)
        .delete('/users/me')
        .send()
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const user = await User.findById(userOne._id)
    //expect(user).toBe(null)
    expect(user).toBeNull()
})

test('Should not delete unauthorized user', async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async ()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user  = await User.findById(userOneID)
    expect(user.avatar).toEqual(expect.any(Buffer)) 
})

test('Should update valid user fields', async () => {
    await request(app)
                        .patch('/users/me')
                        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
                        .send({
                           name: 'Deekshu'
                        })
                        .expect(201)

    const user = await User.findById(userOneID)
    expect(user.name).toEqual('Deekshu') 
})

test('Should not update invalid user fields', async () => {
    const response = await request(app)
                        .patch('/users/me')
                        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
                        .send({
                           location: 'Govandi'
                        })
                        .expect(404)
    
})