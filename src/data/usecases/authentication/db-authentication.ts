
import {
  Authentication,
  AuthenticationParams,
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypted,
  UpdateAccessTokenRepository,
  AuthenticationModel
} from './db-authentication-protocols'
export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasComparer: HashComparer,
    private readonly encrypted: Encrypted,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hasComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypted.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return {
          accessToken,
          name: account.name
        }
      }
    }
    return null
  }
}
