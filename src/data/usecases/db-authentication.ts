import { Authentication } from '@/domain/usecases/authentication'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { Encrypted } from '@/data/protocols/cryptography/encrypted'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasComparer: HashComparer,
    private readonly encrypted: Encrypted,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
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
