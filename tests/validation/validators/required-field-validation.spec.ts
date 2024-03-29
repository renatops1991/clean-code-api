import { RequiredFieldValidation } from '@/validation/validators/required-field-validation'
import { MissingParamError } from '@/presentation/errors'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('foo')
}

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const expectedError = sut.validate({ name: 'foo' })
    expect(expectedError).toEqual(new MissingParamError('foo'))
    expect(expectedError.message).toEqual('Missing param: foo')
  })
  it('Should not return error if validation succeeds', () => {
    const sut = makeSut()
    const expectedError = sut.validate({ foo: 'foo' })
    expect(expectedError).toBeNull()
  })
})
