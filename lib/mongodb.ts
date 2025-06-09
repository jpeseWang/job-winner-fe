import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!
const options = {}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export default clientPromise
