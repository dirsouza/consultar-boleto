import { BoletoService } from '@/services'

describe('BoletoService', () => {
  describe('init method', () => {
    it('should return object value success', () => {
      const mockResult = {
        barCode: '21299758700000020000001121100012100447561740',
        amount: '20.00',
        expirationDate: '2018-07-17'
      }

      const result = BoletoService.init('21290001192110001210904475617405975870000002000')

      expect(result).toEqual(mockResult)
    })
  })
})
