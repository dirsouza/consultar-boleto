export const isString = (fn: any): fn is string => typeof fn === 'string'

export const isObject = (fn: any): fn is object =>
  !isNil(fn) && typeof fn === 'object'

export const isNil = (obj: any): obj is null | undefined =>
  isUndefined(obj) || obj === null

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined'

export const parseToInt = (value: string): number => (isString(value) && !isNil(value)) ? parseInt(value, 10) : NaN

export const parseToFloat = (value: string): number => (isString(value) && !isNil(value)) ? parseFloat(value) : NaN
