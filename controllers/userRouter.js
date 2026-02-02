const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require ('bcrypt')
const { userExtractor } = require('../utils/middleware')

userRouter.use(userExtractor)

userRouter.get ('/', async (_req, res, next) => {

  try {
    const allUsers= await User
      .find({})
      .populate ('blogs', { url: 1, title: 1, author: 1, })

    return res.status (200).json(allUsers)

  } catch (error) {
    next(error)
  }

})

userRouter.get('/:id', async(req, res, next) => {
  const { id } = req.params
  try {

    const user = await User
      .findById(id)
      .populate ('blogs', { url: 1, title: 1, author: 1, })

    if (!user)
      return res
        .status (404)
        .json({ error: 'user not found' })

    return res
      .status(200)
      .json(user)
  }

  catch (error){
    next (error)
  }
})

userRouter.post('/', async (req, res, next) => {

  const { username, name, password } = req.body

  if (!password || !username)
    return res
      .status(400).json({ error: 'password and username are required' })
  if (username.length< 3 )
    return res
      .status(400).json({ error: 'username should have at least 3 characters' })
  if (password.length< 3)
    return res
      .status(400).json({ error: 'password should have at least 3 characters' })

  try
  { const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
      role: 'user'
    })

    const newUser = await user.save()

    return res
      .status(201).json(newUser)

  } catch (error){
    next (error)
  }
})


userRouter.delete ('/:id', async (req, res, next) => {
  const user = req.user
  const { id } = req.params

  try {

    const deletedUser = await User.findById(id)

    if (!deletedUser)
      return res
        .status(404)
        .json({ error: 'user not found' })

    const isAdmin = user.role === 'admin'
    const isSelf = deletedUser._id.toString()=== user._id.toString()

    if (!isAdmin && !isSelf)
      return res.status(401).json({ error: 'unauthorized' })

    await User
      .findByIdAndDelete(id)
    return res
      .status(204)
      .end()

  } catch (error) {
    next(error)
  }

})

userRouter.put ('/:id', async (req, res, next) => {

  const user  = req.user
  const { id } = req.params
  const { username, name } = req.body

  try
  {
    const updatedUser = await User.findById(id)

    if (!updatedUser)
      return res
        .status(404)
        .json({ error: 'user not found' })

    const itSelf = updatedUser.id === user.id
    const isAdmin = user.role === 'admin'

    if (!itSelf && !isAdmin)
      return res
        .status(401)
        .json({ error: 'you dont have permission' })


    const updatedUserData = {
      username: username || updatedUser.username,
      name: name || updatedUser.name
    }

    const updated = await User
      .findByIdAndUpdate(id, updatedUserData, { new: true })

    return res
      .status(200)
      .json(updated)
  }
  catch (error){
    next (error)
  }
})


module.exports=userRouter