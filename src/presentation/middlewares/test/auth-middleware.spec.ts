import { AuthMiddleware } from '../auth-middleware'
import { LoadAccountByToken, HttpRequest } from '../auth-middleware-protocols'
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors'
import { mockLoadAccountByToken } from '@/presentation/test/mocks'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const fixturesRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'accessToken' }
})

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('AuthMiddleware', () => {
  it('Should return 403 if x-access-token no exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'bar'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(fixturesRequest())
    expect(loadSpy).toHaveBeenCalledWith('accessToken', role)
  })
  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockResolvedValueOnce(Promise.resolve(null))
    const expectedResponse = await sut.handle(fixturesRequest())
    expect(expectedResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(success({ accountId: 'foo' }))
  })
  it('Should return 500 if LoadAccountByToken throws error', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const expectedResponse = await sut.handle(fixturesRequest())
    expect(expectedResponse).toEqual(serverError(new Error()))
  })
})
