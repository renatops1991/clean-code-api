import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load (email: string): Promise<AccountModel> {
    const account: AccountModel = {
      id: 'foo',
      name: 'John Foo bar',
      email: 'john@example.com',
      password: 'foo'
    }
    return await new Promise(resolve => resolve(account))
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'john@example.com',
      password: 'foo'
    })
    expect(loadSpy).toHaveBeenCalledWith('john@example.com')
  })
})
