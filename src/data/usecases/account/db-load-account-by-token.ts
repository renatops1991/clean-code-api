import {
  AccountModel,
  Decrypted,
  LoadAccountByTokenRepository,
  LoadAccountByToken
} from './db-account-protocols'
export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypted: Decrypted,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypted.decrypt(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
