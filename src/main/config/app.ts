import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupStaticFiles from './static-files'
import express from 'express'
import setupSwagger from './swagger'

const app = express()
setupStaticFiles(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
