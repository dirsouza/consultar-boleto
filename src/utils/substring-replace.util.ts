export const substringReplace = (str: string, repl: string, inicio: number, tamanho: number): string => {
  if (inicio < 0) inicio = inicio + str.length

  if (tamanho < 0) tamanho = tamanho + str.length - inicio

  return [
    str.slice(0, inicio),
    repl.substr(0, tamanho),
    repl.slice(tamanho),
    str.slice(inicio + tamanho)
  ].join('')
}
