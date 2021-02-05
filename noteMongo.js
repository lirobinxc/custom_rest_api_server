const mongoose = require('mongoose')

// // No longer needed because we are passing in variables through .env
// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)  // returns an Exit Code of 1 means "Uncaught Fatal Exception"
// }

const password = process.env.MONGO_PW
const dbName = process.env.MONGO_DB_NAME

const url = `mongodb+srv://lirobinxc:${password}@cluster0.zpzjs.mongodb.net/${dbName}?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(res => console.log('Connected to MongoDB'))
  .catch(err => `Error connecting to MongoDB, ${err.message}`)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
  }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note

// Creates a new note based on the Note model
// const note = new Note({
//   content: 'Not that cool, dude.',
//   date: new Date(),
//   important: false,
// })

// // No longer necessary inside this module
// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// Note.find({ important: true }).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })