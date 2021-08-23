import { TipoCodigo, TipoBoleto, TimeZone } from '@/enums'
import { BadRequestException } from '@/exceptions'
import { IBoletoValido, IResponseBoleto, ITipoReferencia, ITiposReferencias } from '@/interfaces'
import { parseToFloat, parseToInt, substringReplace } from '@/utils'

export class BoletoService {
  static init (codigo: string): IResponseBoleto {
    const tipoCodigo = this.getTipoCodigo(codigo)

    if (tipoCodigo !== TipoCodigo.LINHA_DIGITAVEL && tipoCodigo === TipoCodigo.CODIGO_BARRAS) {
      throw new BadRequestException('O código é um código de barras e não uma linha digitável')
    }

    const tipoBoleto = this.getTipoBoleto(codigo)
    const { codigoBarras, valor, vencimento } = this.validarCodigoDigitavel(codigo, tipoCodigo, tipoBoleto)

    return {
      barCode: codigoBarras,
      amount: valor.toFixed(2),
      expirationDate: vencimento.toISOString().substr(0, 10)
    }
  }

  static validarCodigoDigitavel (codigo: string, tipoCodigo: string, tipoBoleto: string): IBoletoValido {
    if (Number(codigo.substr(0, 1)) === 8 && [46, 47].includes(codigo.length)) {
      throw new BadRequestException('Esse tipo de boleto deve possuir 48 caracteres')
    }

    if (this.validarCodigoDV(codigo, tipoBoleto).length <= 0) {
      throw new BadRequestException('A validação do dígito verificador falhou')
    }

    return {
      sucesso: true,
      mensagem: 'Boleto válido',
      tipoCodigo,
      tipoBoleto,
      linhaDigitavel: codigo,
      codigoBarras: this.getLinhaDigitavelToCodigoBarras(codigo, tipoBoleto),
      vencimento: this.getDataVencimento(codigo, tipoBoleto),
      valor: this.getValor(codigo, tipoBoleto)
    }
  }

  static validarCodigoDV (codigo: string, tipoBoleto: string): string {
    let bloco1: string
    let bloco2: string
    let bloco3: string
    let bloco4: string
    let bloco5: string

    if (tipoBoleto === TipoBoleto.BANCO) {
      bloco1 = codigo.substr(0, 9) + this.calcularMod10(codigo.substr(0, 9))
      bloco2 = codigo.substr(10, 10) + this.calcularMod10(codigo.substr(10, 10))
      bloco3 = codigo.substr(21, 10) + this.calcularMod10(codigo.substr(21, 10))
      bloco4 = codigo.substr(32, 1)
      bloco5 = codigo.substr(33)

      return (bloco1 + bloco2 + bloco3 + bloco4 + bloco5).toString()
    }

    const tipoReferencia = this.getReferencia(codigo)
    bloco1 = codigo.substr(0, 11)
    bloco2 = codigo.substr(12, 11)
    bloco3 = codigo.substr(24, 11)
    bloco4 = codigo.substr(36, 11)

    if (tipoReferencia.mod === 10) {
      bloco1 += this.calcularMod10(codigo.substr(0, 11))
      bloco2 += this.calcularMod10(codigo.substr(12, 11))
      bloco3 += this.calcularMod10(codigo.substr(24, 11))
      bloco4 += this.calcularMod10(codigo.substr(36, 11))
    } else if (tipoReferencia.mod === 11) {
      bloco1 += this.calcularMod11(codigo.substr(0, 11))
      bloco2 += this.calcularMod11(codigo.substr(12, 11))
      bloco3 += this.calcularMod11(codigo.substr(24, 11))
      bloco4 += this.calcularMod11(codigo.substr(36, 11))
    }

    return (bloco1 + bloco2 + bloco3 + bloco4).toString()
  }

  static calcularMod10 (bloco: string): number {
    let i: number
    let s = ''
    let mult = 2
    let soma = 0

    for (i = bloco.length - 1; i >= 0; i--) {
      s = (mult * parseToInt(bloco.charAt(i))) + s
      if (--mult < 1) mult = 2
    }

    for (i = 0; i < s.length; i++) {
      soma = soma + parseToInt(s.charAt(i))
    }

    soma = soma % 10
    if (soma !== 0) {
      soma = soma - 10
    }

    return soma
  }

  static calcularMod11 (bloco: string): number {
    const codigo = bloco.split('').reverse()
    let multiplicador = 2

    const somatorio = codigo.reduce((acc, current) => {
      const soma = Number(current) * multiplicador
      multiplicador = multiplicador === 9 ? 2 : multiplicador + 1
      return acc + soma
    }, 0)

    const restoDivisao = somatorio % 11

    if ([0, 1].includes(restoDivisao)) return 0
    if ([10].includes(restoDivisao)) return 1

    return 11 - restoDivisao
  }

  static getDataVencimento (codigo: string, tipoBoleto: string): Date {
    const dataBoleto = new Date()
    dataBoleto.setFullYear(1997)
    dataBoleto.setMonth(9)
    dataBoleto.setDate(7)
    dataBoleto.setHours(23, 59, 59)

    let fatorData = 0
    let ano = 0
    let mes = 0
    let dia = 0

    if (tipoBoleto === TipoBoleto.BANCO) {
      fatorData = parseToInt(codigo.substr(33, 4))
    } else {
      const codigoBarras = this.getLinhaDigitavelToCodigoBarras(codigo, tipoBoleto)
      ano = parseInt(codigoBarras.substr(19, 4))
      mes = parseInt(codigoBarras.substr(23, 2)) - 1
      dia = parseInt(codigoBarras.substr(25, 2))
    }

    if (dia > 0 && dia < 31 && mes > 0 && mes < 12 && ano > 2000 && ano < 2200) {
      dataBoleto.setFullYear(ano)
      dataBoleto.setMonth(mes)
      dataBoleto.setDate(dia)
    }

    if (tipoBoleto === TipoBoleto.BANCO) {
      dataBoleto.setDate(dataBoleto.getDate() + fatorData)
      dataBoleto.setTime(dataBoleto.getTime() + dataBoleto.getTimezoneOffset() - TimeZone.SAO_PAULO * 60 * 60 * 1000)
    }

    return dataBoleto
  }

  static getValor (codigo: string, tipoBoleto: string): number {
    let valorBoleto: string
    let valorFinal: string

    if (tipoBoleto === TipoBoleto.BANCO) {
      valorBoleto = codigo.substr(37)
      valorFinal = valorBoleto.substr(0, 8) + '.' + valorBoleto.substr(8, 2)

      let char = valorFinal.substr(1, 1)
      while (char === '0') {
        valorFinal = substringReplace(valorFinal, '', 0, 1)
        char = valorFinal.substr(1, 1)
      }
    } else {
      valorFinal = this.getValorCodigoBarrasArrecadacao(codigo)
    }

    return parseToFloat(valorFinal)
  }

  static getTipoCodigo (codigo: string): string {
    switch (codigo.length) {
      case 44:
        return TipoCodigo.CODIGO_BARRAS
      case 46:
      case 47:
      case 48:
        return TipoCodigo.LINHA_DIGITAVEL
      default:
        throw new BadRequestException('Tamanho do código incorreto')
    }
  }

  static getTipoBoleto (codigo: string): string {
    if (Number(codigo.substring(0, 1)) === 8) {
      switch (Number(codigo.substring(1, 1))) {
        case 1:
          return TipoBoleto.ARRECADACAO_PREFEITURA
        case 2:
          return TipoBoleto.CONVENIO_SANEAMENTO
        case 3:
          return TipoBoleto.CONVENIO_ENERGIA_ELETRICA_E_GAS
        case 4:
          return TipoBoleto.CONVENIO_TELECOMUNICACOES
        case 5:
          return TipoBoleto.ARRECADACAO_ORGAOS_GOVERNAMENTAIS
        case 6:
        case 9:
          return TipoBoleto.OUTROS
        case 7:
          return TipoBoleto.ARRECADACAO_TAXAS_DE_TRANSITO
        default:
          throw new BadRequestException('Tipo de boleto incorreto')
      }
    }

    return TipoBoleto.BANCO
  }

  static getLinhaDigitavelToCodigoBarras (codigo: string, tipoBoleto: string): string {
    if (tipoBoleto === TipoBoleto.BANCO) {
      return codigo.substr(0, 4) +
        codigo.substr(32, 1) +
        codigo.substr(33, 14) +
        codigo.substr(4, 5) +
        codigo.substr(10, 10) +
        codigo.substr(21, 10)
    } else {
      const nCodigo = codigo.split('')
      nCodigo.splice(11, 1)
      nCodigo.splice(22, 1)
      nCodigo.splice(33, 1)
      nCodigo.splice(44, 1)

      return nCodigo.join('')
    }
  }

  static getValorCodigoBarrasArrecadacao (codigo: string): string {
    const isValorEfetivo = this.getReferencia(codigo).efetivo

    let valorBoleto: string|string[]
    let valorFinal: string

    if (isValorEfetivo) {
      valorBoleto = codigo.substr(4, 14)
      valorBoleto = codigo.split('')
      valorBoleto.splice(11, 1)
      valorBoleto = valorBoleto.join('')
      valorBoleto = valorBoleto.substr(4, 11)

      valorFinal = valorBoleto.substr(0, 9) + '.' + valorBoleto.substr(9, 2)

      let char = valorFinal.substr(1, 1)
      while (char === '0') {
        valorFinal = substringReplace(valorFinal, '', 0, 1)
        char = valorFinal.substr(1, 1)
      }
    } else {
      valorFinal = String(0)
    }

    return valorFinal
  }

  static getReferencia (codigo: string): ITipoReferencia {
    const referencia = parseToInt(codigo.substr(2, 1))
    const tiposReferencias: ITiposReferencias = {
      6: { mod: 10, efetivo: true },
      7: { mod: 10, efetivo: false },
      8: { mod: 11, efetivo: true },
      9: { mod: 11, efetivo: false }
    }

    return tiposReferencias[referencia]
  }
}
