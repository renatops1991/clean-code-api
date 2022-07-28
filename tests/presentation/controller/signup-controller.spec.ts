import { SignUpController } from '@/presentation/controllers/signup-controller'
import {
  HttpRequest,
  Validation
} from '@/presentation/protocols'
import { AddAccount, Authentication } from '@/domain/usecases'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import {
  success,
  badRequest,
  serverError,
  forbidden
} from '@/presentation/helpers/http-helper'
import { throwError } from '@/tests/domain/fixtures'
import { mockAddAccount, mockAuthentication, mockValidation } from '@/tests/presentation/mocks'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const fixturesRequest = (): HttpRequest => ({
  body: {
    name: 'John',
    email: 'johnFoo@bar.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

describe('SignUp Controller', () => {
  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })
  it('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(fixturesRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'John',
      email: 'johnFoo@bar.com',
      password: 'password'
    })
  })
  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(success({ accessToken: 'authToken', name: 'john foo bar' }))
  })
  it('Should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = fixturesRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('foo'))
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('foo')))
  })
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(fixturesRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'johnFoo@bar.com', password: 'password' })
  })
  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})