
import { MongoClient, ServerApiVersion } from 'mongodb'

// Use 'as string' to indicate that these environment variables will be defined
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}@${process.env.MONGODB_HOST as string}/${process.env.MONGODB_PARAMS as string}&appName=${process.env.MONGODB_APPNAME as string}`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connectToDatabase () {
  try {
    await client.connect()
  } catch (error) {
    console.error('Failed to connect to the database', error)
  }
}

export { connectToDatabase, client }
