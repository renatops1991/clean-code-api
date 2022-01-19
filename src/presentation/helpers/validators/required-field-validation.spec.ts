import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('foo')
    const expectedError = sut.validate({ name: 'foo' })
    expect(expectedError).toEqual(new MissingParamError('foo'))
  })
})
