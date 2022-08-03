import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'
import { fixturesAccountModel } from '@/tests/domain/fixtures'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccount.Params): Promise<AddAccountRepository.Result> {
      return true
    }
  }

  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
        return await Promise.resolve(fixturesAccountModel())
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

export const mockCheckAccountByEmailRepository =
  (): CheckAccountByEmailRepository => {
    class CheckAccountByEmailRepositoryStub
    implements CheckAccountByEmailRepository {
      async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
        return false
      }
    }
    return new CheckAccountByEmailRepositoryStub()
  }

export const mockLoadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
      async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
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
