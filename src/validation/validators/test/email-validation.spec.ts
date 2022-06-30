import { EmailValidation } from '../email-validation'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { mockEmailValidators } from './mocks'

interface SutType {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  const emailValidatorStub = mockEmailValidators()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  it('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const expectError = sut.validate({ email: 'john@foobar.com' })
    expect(expectError).toEqual(new InvalidParamError('email'))
  })
  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'john@foobar.com' })
    expect(isValidSpy).toHaveBeenCalledWith('john@foobar.com')
  })
  it('Should return null  if EmailValidator no returns an error', () => {
    const { sut } = makeSut()
    const expectedValidate = sut.validate({ email: 'john@foobar.com' })
    expect(expectedValidate).toBeNull()
  })
})
