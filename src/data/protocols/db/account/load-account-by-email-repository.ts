import { AccountModel } from '@/data/usecases/account/db-account-protocols'

export interface LoadAccountByEmailRepository{
  loadByEmail (email: string): Promise<AccountModel>
}
