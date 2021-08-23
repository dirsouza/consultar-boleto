import { substringReplace } from '@/utils'

describe('SubstringReplace Util', () => {
  it('start should be less than zero', () => {
    expect(substringReplace('020.0', '', -1, 1)).toBe('020.')
  })

  it('start should be greater than zero', () => {
    expect(substringReplace('020.0', '', 1, 1)).toBe('00.0')
  })

  it('size should be less than zero', () => {
    expect(substringReplace('020.0', '', 1, -1)).toBe('00')
  })

  it('size should be greater than zero', () => {
    expect(substringReplace('020.0', '', 0, 1)).toBe('20.0')
  })
})
