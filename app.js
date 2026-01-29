const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

//utils
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

//controllers
const blogsRouter = require('./controllers/blogRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/loginRouter')

mongoose.set('strictQuery', false)

logger.info('connecting to MongoDb...')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app