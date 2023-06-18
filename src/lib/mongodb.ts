import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

if (!process.env.MONGODB_URI) {
  throw new Error('Add Mongo URI to .env.local')
}

// if (process.env.NODE_ENV === 'development') {
//   const mongoclientpromise = global._mongoClientPromise
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     global._mongoClientPromise = client.connect()
//   }
//   clientPromise = global._mongoClientPromise
// } else {
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

const clientPromise = new MongoClient(process.env.MONGODB_URI).connect()

export default clientPromise