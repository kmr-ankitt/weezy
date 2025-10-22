import * as dotenv from 'dotenv'
import { prisma } from './prisma/client'

dotenv.config()

prisma.$connect().then(() => {
  console.log('Connected to the database successfully.')
}).catch((error) => {
  console.error('Error connecting to the database:', error)
})    
