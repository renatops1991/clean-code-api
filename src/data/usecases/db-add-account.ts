import { Hashed } from '@/data/protocols/cryptography/hashed'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/account'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hashed: Hashed,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const existsAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!existsAccount) {
      const hashPassword = await this.hashed.hash(accountData.password)
      const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashPassword }))
      return account
    }
    return null
  }
}
