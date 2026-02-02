const Blog = require('../models/blog')
const adminRouter = require('express').Router()
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

adminRouter.use(userExtractor)

//delete all users
adminRouter.delete ('/deleteAllUsers', async (req, res, next) => {

  try {
    if (req.user.role !== 'admin')
      return res.status(401).json({ error: 'unauthorized' })
    await User.deleteMany({ role: { $ne: 'admin' } })
    res.status(204).end()
  } catch (error) {
    next(error)
  }

})

//delete all blogs
adminRouter.delete ('/deleteAllBlogs', async (req, res, next) => {

  try {
    if (req.user.role !== 'admin')
      return res.status(401).json({ error: 'unauthorized' })
    await Blog.deleteMany()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

//promote user to admin
adminRouter.put ('/:id/role', async (req, res, next) => {

  const user  = req.user
  const { id } = req.params
  try
  {
    const updatedUser = await User.findById(id)

    if (!updatedUser
      || user.role !== 'admin')
      return res
        .status(401)
        .json({ error: 'you dont have permission' })

    const { role } = req.body
    const validRoles = ['user', 'vip', 'admin']

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `invalid role. Allowed values are: ${validRoles.join(', ')}`
      })}

    const updatedUserData = {
      role: role || updatedUser.role
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


module.exports = adminRouter