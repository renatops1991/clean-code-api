import setupMiddleware from './middleware'
import setupApolloServer from './apollo-server'
import setupRoutes from './routes'
import setupStaticFiles from './static-files'
import setupSwagger from './swagger'
import express from 'express'

const app = express()
void setupApolloServer(app)
setupStaticFiles(app)
setupSwagger(app)
setupMiddleware(app)
setupRoutes(app)
export default app
