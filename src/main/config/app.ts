import setupMiddleware from '@/main/config/middleware'
import setupRoutes from '@/main/config/routes'
import setupStaticFiles from '@/main/config/static-files'
import setupSwagger from '@/main/config/swagger'
import { setUpApolloServer } from '@/main/graphql/server/apollo-server'
import express, { Express } from 'express'

export const setUpApp = async (): Promise<Express> => {
  const app = express()
  setupStaticFiles(app)
  setupSwagger(app)
  setupMiddleware(app)
  setupRoutes(app)
  const server = setUpApolloServer()
  await server.start()
  server.applyMiddleware({ app })
  return app
}
