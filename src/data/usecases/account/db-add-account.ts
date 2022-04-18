import {
  AddAccount,
  AccountModel,
  AddAccountParams,
  Hashed,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-account-protocols'
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
