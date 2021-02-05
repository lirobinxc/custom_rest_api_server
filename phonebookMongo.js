const mongoose = require('mongoose')

const password = process.env.MONGO_PW
const dbName = process.env.MONGO_DB_NAME

const url = `mongodb+srv://lirobinxc:${password}@cluster0.zpzjs.mongodb.net/${dbName}?retryWrites=true&w=majority`
// // Classic version
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
//   .then(data => console.log(`📣 data ~`, data))
//   .catch(err => {
//     console.log(`📣 Error connecting to MongoDB ~`, err.message)
//   })

// Custom version that has a timeout
const mongoConnect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const connect = async () => {
  let data;
  setTimeout(() => {
    if (!data) {
      console.log(`❌ Connection timed out.`)
      mongoose.connection.close()
      process.exit(1)
    }
  }, 20000)
  try {
    data = await mongoConnect
    console.log(`✅ CONNECTED TO MONGODB!`)
  } catch(err) {
    console.log(`❌ ERROR ~`, err.message)
  }
}
connect()

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person;