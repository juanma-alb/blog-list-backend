const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (_req, res, next) => {
  try {
    const result = await Blog.find({}).populate('user', { username: 1, name: 1 })

    return res.status(200).json(result)
  }
  catch (error){
    next (error)}
})

blogsRouter.get ('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const blog = await Blog
      .findById(id)
      .populate ('user', { name: 1, username: 1 })

    res
      .status(200)
      .json(blog)

  } catch (error){
    next (error)
  }
})

blogsRouter.post('/', async (req, res, next) => {
  const { title, author, url, likes } = req.body

  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ error: 'user not found' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    await savedBlog.populate('user', { username: 1, name: 1 })

    res.status(201).json(savedBlog)

  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {

  try{
    const user = req.user

    if (!user) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog= await Blog.findById(req.params.id)

    if (!blog)
      return res.status(404).json({ error: 'blog not found' })

    if (blog.user.toString() !== user.id)
      return res.status(401).json({ error: 'unauthorized' })

    await Blog.findByIdAndDelete(req.params.id)

    return res.status(204).json().end()
  }

  catch(error){
    next(error)
  }

})

blogsRouter.put('/:id/updateBlog', async (req, res, next) => {

  const { title, author,url } = req.body
  const blog ={
    title,
    author,
    url
  }
  try{
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true, runValidators:true })

    if(!updatedBlog)
      return res.status(404).json({ error: 'blog not found' })
    return res.status(200).json(updatedBlog)}

  catch(error){
    next(error)
  }
})

blogsRouter.put ('/:id', async (req, res, next) => {
  const user = req.user

  if (!user)
    return res.status(401).json({ error: 'you must be logged to do this' })

  const { id } = req.params
  const blog = await Blog.findById(id)

  if(!blog)
    return res.status(404).json({ error: 'blog not found' })

  const blogObj ={
    likes: blog.likes +1
  }
  try {
    const response= await Blog
      .findByIdAndUpdate(req.params.id, blogObj,
        { new: true, runValidators:true })
      .populate('user', { username: 1, name: 1 })


    return res.status(200).json(response)
  }

  catch (error) {
    next (error)
  }
})


blogsRouter.post('/deleteAll', async (req, res) => {
  await Blog.deleteMany({})
  return res.status(204).end()
})

module.exports = blogsRouter