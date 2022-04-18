import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export const mockAccountModel = (): AccountModel => ({
  id: 'foo',
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'hashPassword'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'validPassword'
})
