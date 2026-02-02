const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


//GET ----------------------------------------------------------------

//all blogs
blogsRouter.get('/', async (_req, res, next) => {
  try {
    const result = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })
      .populate('comments.user', { username: 1 })
    return res.status(200).json(result)
  }
  catch (error){
    next (error)}
})

//one blog
blogsRouter.get ('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const blog = await Blog
      .findById(id)
      .populate ('user', { name: 1, username: 1 })
      .populate('comments.user', { username: 1 })


    res
      .status(200)
      .json(blog)

  } catch (error){
    next (error)
  }
})

//all comments of a blog
blogsRouter.get ('/:id/comments', async (req, res, next) => {

  const { id } = req.params

  try {
    const blog = await Blog.findById(id)

    if (!blog)
      return res.status(404).json({ error: 'blog not found' })
    const comment = blog.comments

    console.log(blog)

    return res.status(200).json (comment)

  } catch (error) {
    next (error)
  }
})

//a blog's comment
blogsRouter.get ('/:id/comments/:commentId', async (req, res, next) => {

  const { id } = req.params //blog id
  const { commentId } = req.params //comment id

  try {
    const blog = await Blog.findById(id)

    if (!blog)
      return res.status(404).json({ error: 'blog not found' })

    const comments = blog.comments

    const comment = comments.find(comment => comment.id === commentId)

    if (!comment)
      return res.status(404).json({ error: 'comment not found' })

    return res.status(200).json (comment)

  } catch (error) {
    next (error)
  }
})


//POST ----------------------------------------------------------------
blogsRouter.use(userExtractor)

//add a blog
blogsRouter.post('/', async (req, res, next) => {

  const { title, author, url, likes, top } = req.body
  try
  {
    const user = req.user
    if (!user)
      return res.status(401).json({ error: 'user not found' })

    const blog = new Blog({
      title,
      author,
      url,
      top: user.role === 'vip' && top===true,
      likes: likes || 0,
      user: user._id,
    })

    const newBlog = await blog
      .save()

    user.blogs = user.blogs.concat (newBlog)
    await user.save()

    await newBlog.populate('user', { username: 1, name: 1 })

    return res.status(201).json(newBlog)

  }
  catch(error){
    next(error)
  }
})

//add a comment
blogsRouter.post('/:id/comments', async (req, res, next) => {
  const { id } = req.params
  const { content } = req.body
  const user =req.user

  try {
    if (!user)
      return res.status(401).json({ error: 'you must be logged to comment a blog' })
    if (!content)
      return res.status(400).json({ error: 'you cant post empty comments' })


    const comment = {
      content,
      user: user._id
    }

    const blog = await Blog.findById(id)

    blog.comments= blog.comments.concat(comment)

    await blog.save()

    console.log(blog)

    const populatedBlog = await Blog.findById(id)
      .populate('user', { username: 1, name: 1 })
      .populate('comments.user', { username: 1 })

    console.log(populatedBlog)


    return res.status(201).json(populatedBlog)


  }
  catch(error){
    next (error)
  }
})

//DELETE ----------------------------------------------------------------

//delete a blog
blogsRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  const user = req.user

  try{
    if (!user) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const userId= user.id.toString()

    const blog= await Blog.findById(id)

    if (!blog)
      return res.status(404).json({ error: 'blog not found' })

    if (blog.user._id.toString() !== userId && user.role !== 'admin')
      return res.status(401).json({ error: 'unauthorized' })

    await Blog.findByIdAndDelete(id)

    return res.status(204).json().end()
  }

  catch(error){
    next(error)
  }

})

//delete a comment
blogsRouter.delete('/:id/comments/:commentId', async (req, res, next) => {

  const { id } = req.params //blog id
  const { commentId } = req.params //comment id
  const user = req.user

  try{
    if (!user)
      return res.status(401).json({ error: 'token missing or invalid' })

    const userId= user.id.toString()

    const blog = await Blog.findById(id)
    if (!blog)
      return res.status(404).json({ error: 'blog not found' })

    const comment = blog.comments.id(commentId)
    if (!comment)
      return res.status(404).json({ error: 'comment not found' })

    const isAdmin = user.role === 'admin'
    const isBlogOwner = blog.user.toString() === userId
    const isCommentOwner = comment.user.toString() === userId

    if (!isBlogOwner && !isAdmin && !isCommentOwner)
      return res.status(401).json({ error: 'unauthorized' })

    comment.deleteOne()
    await blog.save()

    return res.status(204).json().end()

  }

  catch(error){
    next(error)
  }
})

//PUT ----------------------------------------------------------------
blogsRouter.put('/:id', async (req, res, next) => {

  const { title, url } = req.body
  const { id } = req.params
  const user = req.user

  try{

    const blogToUpdate = await Blog.findById(id)

    if (!blogToUpdate)
      return res.status(404).json({ error: 'blog not found' })

    const isBlogOwner = blogToUpdate.user.toString() === user.id.toString()
    const isAdmin = user.role === 'admin'

    if (!isBlogOwner && !isAdmin)
      return res.status(401).json({ error: 'unauthorized' })

    const blog ={
      title,
      url
    }
    const updatedBlog = await Blog
      .findByIdAndUpdate(id, blog, { new: true, runValidators:true })

    if(!updatedBlog)
      return res.status(404).json({ error: 'blog not found' })

    return res.status(200).json(updatedBlog)}

  catch(error){
    next(error)
  }
})


module.exports = blogsRouter