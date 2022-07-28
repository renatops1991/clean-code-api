import { ValidationComposite } from '@/validation/validators/validation-composite'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { mockValidation } from '../mocks'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
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
    expect(expectedError.message).toEqual('Missing param: email')
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
    expect(expectedError).toBeNull()
  })
})
