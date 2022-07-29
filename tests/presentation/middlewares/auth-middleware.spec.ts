import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import {
  forbidden,
  serverError,
  success
} from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/errors'
import { mockLoadAccountByToken } from '@/tests/presentation/mocks'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const fixtureRequest = (): AuthMiddleware.Request => ({
  accessToken: 'accessToken'
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
    const expectedResponse = await sut.handle({})
    expect(expectedResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'bar'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(fixtureRequest())
    expect(loadSpy).toHaveBeenCalledWith('accessToken', role)
  })
  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockResolvedValueOnce(Promise.resolve(null))
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toEqual(success({ accountId: 'foo' }))
  })
  it('Should return 500 if LoadAccountByToken throws error', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockResolvedValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toEqual(serverError(new Error()))
  })
})
