import { Hashed } from '@/data/protocols/cryptography/hashed'
import {
  AddAccountRepository,
  CheckAccountByEmailRepository
} from '@/data/protocols/db/account'
import { AddAccount } from '@/domain/usecases/add-account'
export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hashed: Hashed,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const existsAccount = await this.checkAccountByEmailRepository.checkByEmail(
      accountData.email
    )
    if (!existsAccount) {
      const hashPassword = await this.hashed.hash(accountData.password)
      return await this.addAccountRepository.add({
        ...accountData,
        password: hashPassword
      })
    }
    return false
  }
}
