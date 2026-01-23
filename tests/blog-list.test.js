//imports
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'String',
    author: 'String',
    url: 'String',
    likes: 8
  },
  {
    title: 'String2',
    author: 'String2',
    url: 'String2',
    likes: 10
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('supertest tests', () => {

  test('return 200 and blog-list', async () => {
    const response = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)

    expect(response.status).toBe(200)

  })

  test ('return 2 blog-list', async () => {
    const response= await api.get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)

  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]

    expect(blog.id).toBeDefined()
  })

  test ('post a note, list should increase', async () => {

    const blog={
      title: 'hi',
      author: 'juan',
      url: 'String',
      likes: 8
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)

    const response= await api.get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length +1)

    const bodyTitle = response.body.map (r => r.title).includes('hi')

    expect(bodyTitle).toBeTruthy()
  })

  test('if  likes property is missing from the request, it defaults to 0', async () => {

    const blog = {
      title: 'String',
      author: 'String',
      url: 'String'
    }
    await api
      .post('/api/blogs')
      .send(blog)

    const response = await api.get ('/api/blogs')

    const lastBlog = response.body[response.body.length-1]

    expect(lastBlog.likes).toBe(0)
  })

})


test.only('url and title properties are required, if not return 400 bad request', async () => {

  const blog = {
    author: 'String',
    likes: 0
  }
  await api
    .post('/api/blogs')
    .send (blog)
    .expect(400)

})

afterAll(async () => {
  await mongoose.connection.close()
})
