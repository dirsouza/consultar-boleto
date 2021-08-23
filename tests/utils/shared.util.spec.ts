import { isNil, isObject, isString, isUndefined, parseToInt, parseToFloat } from '@/utils'

describe('Shared Util', () => {
  describe('isString', () => {
    it('should return true if the value is a string', () => {
      expect(isString('test')).toBe(true)
    })

    it('should return false if the value is not a string', () => {
      expect(isString(123)).toBeFalsy()
    })
  })

  describe('isObject', () => {
    it('should return true if the value is a object', () => {
      expect(isObject({})).toBe(true)
    })

    it('should return false if the value is not a object', () => {
      expect(isObject('text')).toBeFalsy()
    })
  })

  describe('isNil', () => {
    it('should return true if the value is a null or undefined', () => {
      expect(isNil(null)).toBe(true)
      expect(isNil(undefined)).toBe(true)
    })

    it('should return false if the value is not a null or undefined', () => {
      expect(isNil('text')).toBeFalsy()
    })
  })

  describe('isUndefined', () => {
    it('should return true if the value is a undefined', () => {
      expect(isUndefined(undefined)).toBe(true)
    })

    it('should return false if the value is not a undefined', () => {
      expect(isUndefined(null)).toBeFalsy()
    })
  })

  describe('parseToInt', () => {
    it('should convert the passed string to number', () => {
      expect(parseToInt('123')).toBe(123)
      expect(parseToInt('123abc')).toBe(123)
      expect(parseToInt('abc')).toBe(NaN)
      expect(parseToInt('')).toBe(NaN)
    })
  })

  describe('parseToFloat', () => {
    it('should convert the passed string to float number', () => {
      expect(parseToFloat('123.1')).toBe(123.1)
      expect(parseToFloat('123.1abc')).toBe(123.1)
      expect(parseToFloat('abc')).toBe(NaN)
      expect(parseToFloat('')).toBe(NaN)
    })
  })
})
