import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client } from '@/db' // your mongodb client

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DB_NAME as string)),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  }
})
