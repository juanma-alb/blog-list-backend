const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (_req, res, next) => {
  try {
    const result = await Blog.find({})

    return res.status(200).json(result)
  }
  catch (error){
    next (error)}
})

blogsRouter.post('/', async (req, res, next) => {
  const { title, author, url, likes } = req.body
  const blog = new Blog({
    title,
    author,
    url,
    likes
  })
  try
  {
    const newBlog = await blog.save()

    if (!newBlog) return res.status(404).json({ error: 'error saving blog' })

    return res.status(201).json(newBlog)

  }
  catch(error){
    next(error)
  }
})

module.exports = blogsRouter