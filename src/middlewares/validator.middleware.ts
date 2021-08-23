import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { BadRequestException } from '@/exceptions'

export const validatorMiddleware = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(async validation => validation.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const badRequest = new BadRequestException({ errors: errors.array() })
      return res.status(badRequest.getStatus()).json(badRequest.getResponse())
    }
    next()
  }
}
