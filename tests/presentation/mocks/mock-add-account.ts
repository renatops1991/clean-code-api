import { fixturesAccountModel } from '@/tests/domain/fixtures'
import { AddAccount } from '@/domain/usecases'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return true
    }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
      return await Promise.resolve(fixturesAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
