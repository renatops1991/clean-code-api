
import { forbidden, serverError, success } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'
import { HttpRequest } from '../protocols'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeAccount = (): AccountModel => ({
  id: 'foo',
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'hashPassword'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'accessToken' }
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
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
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('accessToken', role)
  })
  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockResolvedValueOnce(new Promise(resolve => resolve(null)))
    const expectedResponse = await sut.handle(makeFakeRequest())
    expect(expectedResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(success({ accountId: 'foo' }))
  })
  it('Should return 500 if LoadAccountByToken throws error', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const expectedResponse = await sut.handle(makeFakeRequest())
    expect(expectedResponse).toEqual(serverError(new Error()))
  })
})
