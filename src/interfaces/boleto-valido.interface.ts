export interface IBoletoValido {
  sucesso: boolean
  mensagem: string
  tipoCodigo: string
  tipoBoleto: string
  linhaDigitavel: string
  codigoBarras: string
  vencimento: Date
  valor: number
}
