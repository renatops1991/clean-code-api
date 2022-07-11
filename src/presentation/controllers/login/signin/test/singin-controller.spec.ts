import { LoginController } from '../signin-controller'
import {
  HttpRequest,
  Authentication,
  Validation
} from '../signin-controller-protocols'
import { badRequest, serverError, success, unauthorized } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/fixtures'
import { MissingParamError } from '@/presentation/errors'
import { mockAuthentication, mockValidation } from '@/presentation/test/mocks'

const fixturesRequest = (): HttpRequest => ({
  body: {
    email: 'john@foobar.com',
    password: 'foo'
  }
})

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return { sut, authenticationStub, validationStub }
}

describe('LoginController', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(fixturesRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'john@foobar.com', password: 'foo' })
  })
  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(success({ accessToken: 'authToken', name: 'john foo bar' }))
  })
  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = fixturesRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('Should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('email'))
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual((badRequest(new MissingParamError('email'))))
  })
})
