import { Hashed } from '@/data/protocols/cryptography/hashed'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { AddAccount } from '@/domain/usecases/add-account'
export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hashed: Hashed,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashPassword = await this.hashed.hash(accountData.password)
      return await this.addAccountRepository.add(({ ...accountData, password: hashPassword }))
    }
    return false
  }
}
