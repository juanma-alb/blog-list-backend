const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')


//let token = null

beforeEach(async () => {

  await User.deleteMany({})

  /* const passwordHash = await bcrypt.hash('secret', 8)

  let userObject = new User({ name: 'asd123', username: 'asdf', passwordHash })
  let userObject2 = new User({ name: 'asd321', username: 'fdsa', passwordHash })

  await Promise.all([userObject.save(), userObject2.save()])

  const userRegistred = {
    username:'juan123',
    name:'juan',
    password:'asd123'

  }

  const response = await api
    .post('/api/users')
    .send(userRegistred)

  const loguedUser = await api
    .post('/api/login')
    .send(response.body)

  token = loguedUser.body.token */
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


describe('vip user tests', () => {

  test ('vip user login flow', async () => {

    const passwordHash = await bcrypt.hash('asd123', 8)

    const userRegister = new User({
      username: 'juan3',
      name: 'juan',
      passwordHash,
      role: 'vip'
    })

    await userRegister.save()

    const login= await api
      .post('/api/login')
      .send({ username: 'juan3', password: 'asd123' })
      .expect(200)

    const token = login.body.token

    const response = await api
      .get('/api/users')
      .expect(200)

    expect(response.body[response.body.length-1].role).toBe('vip')

    const vipUserBlogPost = {
      title: 'hi',
      author: 'juan',
      url: 'www',
      likes: 0,
      top: true
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(vipUserBlogPost)
      .expect(201)

    expect(postResponse.body.top).toBe(true)
  })

})


describe.only('comment tests', () => {

  test ('comment can be added', async () => {

    const passwordHash = await bcrypt.hash('asd123', 8)

    const userRegister = new User({
      username: 'juan123',
      name: 'juan',
      passwordHash,
      role: 'user'
    })

    await userRegister.save()

    const login= await api
      .post('/api/login')
      .send({ username: 'juan123', password: 'asd123' })
      .expect(200)

    const token = login.body.token

    const response = await api
      .get('/api/blogs')
      .expect(200)

    const blogId = response.body[0].id

    const comment = {
      content: 'hi'
    }

    await api
      .post(`/api/blogs/${blogId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send(comment)
      .expect(201)

    const comments = await api
      .get(`/api/blogs/${blogId}/comments`)
      .expect(200)

    expect(comments.body.length).toBe(1)

    expect(comments.body[0].content).toBe('hi')

  })
})




afterAll(async () => {
  await mongoose.connection.close()
})
