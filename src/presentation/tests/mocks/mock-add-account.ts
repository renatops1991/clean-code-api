import { fixturesAccountModel } from '@/domain/fixtures'
import { AddAccount, AddAccountParams } from '../../controllers/login/signup/signup-controller-protocols'
import { AccountModel } from '@/domain/models/account'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => resolve(fixturesAccountModel()))
    }
  }
  return new AddAccountStub()
}
