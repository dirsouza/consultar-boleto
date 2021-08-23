import { isString } from '@/utils'
import { checkSchema } from 'express-validator'

export const boletoSchema = checkSchema({
  codigo: {
    in: ['params'],
    isNumeric: {
      errorMessage: 'Código deve ser um numérico'
    },
    custom: {
      options: value => isString(value) ? [46, 47, 48].includes(value.length) : false,
      errorMessage: 'Código deve ter 46, 47 ou 48 dígitos'
    }
  }
})
