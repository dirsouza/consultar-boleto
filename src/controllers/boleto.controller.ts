import { HttpException, InternalServerErrorException } from '@/exceptions'
import { IResponseBoleto } from '@/interfaces'
import { BoletoService } from '@/services'
import { Request, Response } from 'express'

export class BoletoController {
  static boleto (req: Request, res: Response): IResponseBoleto|void {
    try {
      const { codigo } = req.params
      res.status(200).send(BoletoService.init(codigo))
    } catch (e) {
      if (e instanceof HttpException) {
        res.status(e.getStatus()).send(e.getResponse())
      } else {
        const error = new InternalServerErrorException(e.message)
        res.status(error.getStatus()).send(error.getResponse())
      }
    }
  }
}
