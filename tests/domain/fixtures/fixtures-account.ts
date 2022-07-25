import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/add-account'
import { AuthenticationParams } from '@/domain/usecases/authentication'

export const fixturesAddAccountParams = (): AddAccountParams => ({
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
