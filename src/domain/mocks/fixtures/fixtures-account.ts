import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'

export const fixturesAccountModel = (): AccountModel => ({
  id: 'foo',
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'hashPassword'
})

export const fixturesAddAccountParams = (): AddAccountParams => ({
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'validPassword'
})

export const fixturesAuthentication = (): AuthenticationParams => ({
  email: 'john@example.com',
  password: 'foo'
})
