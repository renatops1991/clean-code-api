import { AccountModel } from '@/data/usecases/account/db-add-account-protocols'

export interface LoadAccountByTokenRepository {
  loadByToken (token: string, role?: string): Promise<AccountModel>
}
