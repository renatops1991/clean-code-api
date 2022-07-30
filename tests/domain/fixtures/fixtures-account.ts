import { Authentication } from '@/domain/usecases/authentication'
import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/usecases/add-account'

export const fixturesAddAccountParams = (): AddAccount.Params => ({
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'hashPassword'
})

export const fixturesAccountModel = (): AccountModel => Object.assign({}, fixturesAddAccountParams(), {
  id: 'foo'
})

export const fixturesAuthentication = (): Authentication.Params => ({
  email: 'john@example.com',
  password: 'foo'
})
