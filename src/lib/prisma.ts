import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL as string

const prismaClientSingleton = () => {
  const pool = new Pool({ 
    connectionString,
    max: 2, // Crucial for serverless to prevent connection pool exhaustion
    idleTimeoutMillis: 15000, // Close idle connections quickly
    connectionTimeoutMillis: 5000, // Fail fast on timeouts
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
