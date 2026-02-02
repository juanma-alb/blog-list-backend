const User = require('../models/user')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

let token = null

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const passwordHash = await bcrypt.hash('secret', 8)

  let userObject = new User({ name: 'asd123', username: 'asdf', passwordHash:'1234', role: 'user' })
  let userObject2 = new User({ name: 'asd321', username: 'fdsa', passwordHash:'1234', role: 'user'  })

  let blogObject = new Blog({ title: 'String', author: 'String', url: 'String', likes: 8, top: false, user: userObject._id })
  let blogObject2 = new Blog({ title: 'String2', author: 'String2', url: 'String2', likes: 10, top: false, user: userObject2._id })

  let admin= new User ({
    username: 'admin1',
    name: 'admin',
    passwordHash,
    role: 'admin'
  })

  await Promise.all([userObject.save(), userObject2.save(), blogObject.save(), blogObject2.save(), admin.save()])



  const login = await api
    .post('/api/login')
    .send({ username: 'admin1', password: 'secret' })
    .expect(200)

  token = login.body.token

})

describe('admin tests', () => {

  test('delete all users, except admin', async () => {
    await api
      .delete('/api/admin/deleteAllUsers')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const response = await api
      .get('/api/users')
      .expect(200)

    expect(response.body.length).toBe(1)
  })

  test('delete a single user', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)

    expect(response.body.length).toBe(3)

    await api
      .delete(`/api/users/${response.body[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const response2 = await api
      .get('/api/users')
      .expect(200)

    expect(response2.body.length).toBe(2)

  })

  test('delete all blogs', async () => {

    const allBlogs = await api
      .get('/api/blogs')
      .expect(200)

    expect(allBlogs.body.length).toBe(2)

    await api
      .delete('/api/admin/deleteAllBlogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const response = await api
      .get('/api/blogs')
      .expect(200)

    expect(response.body.length).toBe(0)

  })

  test('delete a single blog', async () => {

    const allBlogs = await api
      .get('/api/blogs')
      .expect(200)

    expect(allBlogs.body.length).toBe(2)

    const blogToDeleteId = allBlogs.body[0].id

    await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const response = await api
      .get('/api/blogs')
      .expect(200)

    expect(response.body.length).toBe(1)
  })


  test ('update a user blog', async () => {

    const allBlogs = await api
      .get('/api/blogs')
      .expect(200)

    const blogToUpdate = await Blog.findById(allBlogs.body[0].id)

    expect (blogToUpdate.title).toBe('String')

    const blogToUpdateObject = {
      title: 'String123',
    }


    await api
      .put(`/api/blogs/${allBlogs.body[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToUpdateObject)
      .expect(200)

    const blogToUpdate2 = await Blog.findById(allBlogs.body[0].id)
    expect(blogToUpdate2.title).toBe('String123')
  })


})

afterAll(async () => {
  await mongoose.connection.close()
})