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
    let token: string
    try {
      token = await this.decrypted.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
