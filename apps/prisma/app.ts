import * as dotenv from 'dotenv'
import { prisma } from './client'

dotenv.config();


prisma.$connect().then(() => {
  console.log('Connected to the database successfully.')
}).catch((error) => {
  console.error('Error connecting to the database:', error)
})    

export { prisma } from './client'