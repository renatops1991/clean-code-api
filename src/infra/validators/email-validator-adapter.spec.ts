import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('Email Validator', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('foo@')
    expect(isValid).toBe(false)
  })
  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('foo@bar.com')
    expect(isValid).toBe(true)
  })
  it('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('foo@bar.com')
    expect(isEmailSpy).toHaveBeenCalledWith('foo@bar.com')
  })
})
