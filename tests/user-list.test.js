const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')



beforeEach(async () => {

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 8)

  let userObject = new User({ name: 'asd123', username: 'asdf', passwordHash })
  let userObject2 = new User({ name: 'asd321', username: 'fdsa', passwordHash })

  await Promise.all([userObject.save(), userObject2.save()])
})


describe('user tests', () => {

  test('username must be unique and user with password or username with less than 3 character returns 400', async () => {

    //user with username less than 3
    const newUser={
      username:'12',
      name: '12345',
      password:'12345'
    }

    await api
      .post('/api/users')
      .send (newUser)
      .expect(400)

    //user with password less than 3
    const newUser2={
      username:'12345',
      name: '12345',
      password:'12'
    }

    await api
      .post('/api/users')
      .send (newUser2)
      .expect(400)


  })

  test ('username must be unique', async () => {
    //user with duplicated username
    const newUser={
      username:'12345',
      name: '54321',
      password:'54321'
    }

    await api
      .post('/api/users')
      .send (newUser)
      .expect(201)

    const newUser2={
      username:'12345',
      name: '12345',
      password:'12345'
    }

    await api
      .post('/api/users')
      .send (newUser2)
      .expect(400)
  })


})



afterAll(async () => {
  await mongoose.connection.close()
})
