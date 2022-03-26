import { AccountModel } from '@/data/usecases/account/db-add-account-protocols'

export interface LoadAccountByEmailRepository{
  loadByEmail (email: string): Promise<AccountModel>
}
