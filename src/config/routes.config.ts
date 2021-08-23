import { BadRequestException } from '@/exceptions'
import { Express, Router, Response } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  readdirSync(join(__dirname, '../routes'))
    .filter(file => !file.endsWith('.map'))
    .map(async file => (await import(`../routes/${file}`)).default(router))

  app.use(router)
  app.use((_, res: Response) => {
    const badRequestException = new BadRequestException('Serviço não mapeado')
    res.status(badRequestException.getStatus()).send(badRequestException.getResponse())
  })
}
