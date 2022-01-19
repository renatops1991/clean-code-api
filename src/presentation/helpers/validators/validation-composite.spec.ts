import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return new MissingParamError('email')
  }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const expectedError = sut.validate({ email: 'foo' })
    expect(expectedError).toEqual(new MissingParamError('email'))
  })
})
