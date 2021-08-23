import express from 'express'
import { setupMiddlewares } from '@/config/middlewares.config'
import { setupRoutes } from '@/config/routes.config'

const app = express()
setupMiddlewares(app)
setupRoutes(app)

export { app }
