
import { DbAddAccount, DbLoadAccountByToken } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { AddAccount } from '@/domain/usecases//add-account'
import { LoadAccountByToken } from '@/domain/usecases//load-account-by-token'
import env from '@/main/config/env'

export const makeDbAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
