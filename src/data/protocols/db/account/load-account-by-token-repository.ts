import { AccountModel } from '@/data/usecases/account/db-account-protocols'

export interface LoadAccountByTokenRepository {
  loadByToken (token: string, role?: string): Promise<AccountModel>
}
