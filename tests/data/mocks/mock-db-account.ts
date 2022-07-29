import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/usecases'
import { fixturesAccountModel } from '@/tests/domain/fixtures'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
      return await Promise.resolve(fixturesAccountModel())
    }
  }

  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel> {
        return await Promise.resolve(fixturesAccountModel())
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

export const mockLoadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
      async loadByToken (token: string, role?: string): Promise<AccountModel> {
        return await Promise.resolve(fixturesAccountModel())
      }
    }
    return new LoadAccountByTokenRepositoryStub()
  }

export const mockUpdateAccessTokenRepository =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
    implements UpdateAccessTokenRepository {
      async updateAccessToken (id: string, token: string): Promise<void> {
        return await Promise.resolve()
      }
    }
    return new UpdateAccessTokenRepositoryStub()
  }
