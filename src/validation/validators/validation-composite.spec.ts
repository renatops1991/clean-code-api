import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('email'))
    const expectedError = sut.validate({ email: 'foo' })
    expect(expectedError).toEqual(new MissingParamError('email'))
  })
  it('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('email'))
    const expectedError = sut.validate({ email: 'foo' })
    expect(expectedError).toEqual(new Error())
  })
  it('Should not return error if validation succeeds', () => {
    const { sut } = makeSut()
    const expectedError = sut.validate({ email: 'foo' })
    expect(expectedError).toBeFalsy()
  })
})
