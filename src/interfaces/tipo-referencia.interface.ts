export interface ITipoReferencia {
  mod: number
  efetivo: boolean
}

export interface ITiposReferencias {
  [key: number]: ITipoReferencia
}
