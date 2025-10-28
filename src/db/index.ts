
import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

// Use 'as string' to indicate that these environment variables will be defined
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}@${process.env.MONGODB_HOST as string}/${process.env.MONGODB_PARAMS as string}&appName=${process.env.MONGODB_APPNAME as string}`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connectMongooseToDatabase (): Promise<void> {
  try {
    await mongoose.connect(uri)
    console.log('Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

async function connectToDatabase (): Promise<void> {
  try {
    await client.connect()
  } catch (error) {
    console.error('Failed to connect to the database', error)
  }
}

export { client, connectToDatabase, connectMongooseToDatabase }
