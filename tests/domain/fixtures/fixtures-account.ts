import { Authentication } from '@/domain/usecases/authentication'
import { AddAccount } from '@/domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '@/data/protocols'

export const fixturesAddAccountParams = (): AddAccount.Params => ({
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'hashPassword'
})

export const fixturesAccountModel = (): LoadAccountByEmailRepository.Result => ({
  id: 'foo',
  name: 'john foo bar',
  password: 'hashPassword'
})

export const fixturesAuthentication = (): Authentication.Params => ({
  email: 'john@example.com',
  password: 'foo'
})
