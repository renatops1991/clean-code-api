import { AccountModel } from '@/domain/models/account'
import { AuthenticationParams } from '@/domain/usecases/authentication'
import { AddAccount } from '../usecases'

export const fixturesAddAccountParams = (): AddAccount.Params => ({
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'hashPassword'
})

export const fixturesAccountModel = (): AccountModel => Object.assign({}, fixturesAddAccountParams(), {
  id: 'foo'
})

export const fixturesAuthentication = (): AuthenticationParams => ({
  email: 'john@example.com',
  password: 'foo'
})
