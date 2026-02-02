const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

  username: { type: String,
    required: [true, 'username is required'],
    unique: true,
    minlength: 3 },

  name: {
    type:String,
    required: [true, 'name is required'] },

  passwordHash: {
    type: String,
    required: [true, 'password is required'] },

  role: { type: String, default: 'user' },

  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // 🛡️ CAMBIO IMPORTANTE: Agregamos este IF de seguridad
    // Solo intentamos convertir el ID si realmente existe
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString()
    }

    delete returnedObject._id
    delete returnedObject.__v
    // La contraseña hash no debe mostrarse
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
