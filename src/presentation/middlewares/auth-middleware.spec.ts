
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

const makeFakeAccount = (): AccountModel => ({
  id: 'foo',
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'hashPassword'
})
describe('AuthMiddleware', () => {
  it('Should return 403 if x-access-token no exists in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<AccountModel> {
        return await new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<AccountModel> {
        return await new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    await sut.handle({
      headers: { 'x-access-token': 'accessToken' }
    })
    expect(loadSpy).toHaveBeenCalledWith('accessToken')
  })
})
