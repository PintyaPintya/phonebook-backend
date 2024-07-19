const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.DB

console.log('connecting to db')
mongoose.connect(url)
  .then(result => {
    console.log('connected to mongoDb')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name required'],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User number required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)