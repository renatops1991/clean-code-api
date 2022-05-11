import { fixturesAccountModel } from '@/domain/fixtures'
import { AddAccount, AddAccountParams } from '../../controllers/login/signup/signup-controller-protocols'
import { AccountModel } from '@/domain/models/account'
import { LoadAccountByToken } from '@/presentation/middlewares/auth-middleware-protocols'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(fixturesAccountModel())
    }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(fixturesAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
