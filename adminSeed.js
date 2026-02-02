const User = require('./models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
require ('dotenv').config()

const seedAdmin = async () => {

  mongoose.connect(process.env.MONGODB_URI)
  mongoose.set('strictQuery', false)

  const passwordHash = await bcrypt.hash('secret', 8)

  const user = new User({
    username: 'admin1',
    name: 'admin',
    passwordHash,
    role: 'admin'
  })

  await user.save()
  mongoose.connection.close()
}

seedAdmin()


