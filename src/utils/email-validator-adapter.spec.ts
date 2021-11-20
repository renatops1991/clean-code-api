import { EmailValidatorAdapter } from './email-validator-adapter'

describe('Email Validator', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('foo@bar.com')
    expect(isValid).toBe(false)
  })
})
