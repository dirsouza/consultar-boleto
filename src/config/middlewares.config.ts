import { Express, urlencoded, json } from 'express'
import cors from 'cors'

export const setupMiddlewares = (app: Express): void => {
  app.use(cors())
  app.use(urlencoded({ extended: true }))
  app.use(json())
}
