import { Router } from 'express'
import { validatorMiddleware } from '@/middlewares'
import { boletoSchema } from '@/schemas'
import { BoletoController } from '@/controllers'

export default (router: Router): void => {
  router.get('/boleto/:codigo', validatorMiddleware([boletoSchema]), BoletoController.boleto)
}
