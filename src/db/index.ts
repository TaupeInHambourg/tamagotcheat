/**
 * Database Connection Module
 *
 * Manages MongoDB connections using both native MongoDB driver and Mongoose ODM.
 * Provides centralized connection management following the Singleton pattern.
 *
 * Connections:
 * - MongoClient: Used by better-auth for authentication
 * - Mongoose: Used for application data models
 */

import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

/**
 * Constructs MongoDB connection URI from environment variables
 * Format: mongodb+srv://username:password@host/params&appName
 */
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}@${process.env.MONGODB_HOST as string}/${process.env.MONGODB_PARAMS as string}&appName=${process.env.MONGODB_APPNAME as string}`

/**
 * MongoDB client instance
 * Configured with Stable API v1 for long-term compatibility
 */
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

/**
 * Establishes Mongoose connection to MongoDB
 *
 * Uses the same connection URI as the native client.
 * Mongoose provides ODM functionality for schema-based models.
 *
 * @throws {Error} If connection fails
 */
async function connectMongooseToDatabase (): Promise<void> {
  try {
    await mongoose.connect(uri)
    console.log('Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
    throw error
  }
}

/**
 * Establishes native MongoDB client connection
 *
 * Used primarily by better-auth for user authentication.
 * Call this before using authentication features.
 *
 * @throws {Error} If connection fails
 */
async function connectToDatabase (): Promise<void> {
  try {
    await client.connect()
    console.log('MongoDB client connected successfully')
  } catch (error) {
    console.error('Failed to connect to the database', error)
    throw error
  }
}

export { client, connectToDatabase, connectMongooseToDatabase }
