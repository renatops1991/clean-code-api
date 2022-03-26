import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '@/presentation/errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('password', 'passwordConfirmation')
}
describe('CompareFields Validation', () => {
  it('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const expectedError = sut.validate({
      password: '123',
      passwordConfirmation: 'foo'
    })
    expect(expectedError).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  it('Should no return error if validation succeeds', () => {
    const sut = makeSut()
    const expectedError = sut.validate({
      password: '123',
      passwordConfirmation: '123'
    })
    expect(expectedError).toBeFalsy()
  })
})
