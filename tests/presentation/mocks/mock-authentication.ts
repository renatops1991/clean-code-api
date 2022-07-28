import {
  AuthenticationParams,
  Authentication
} from '@/domain/usecases/authentication'
import { AuthenticationModel } from '@/domain/models/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationSub implements Authentication {
    async auth (
      authentication: AuthenticationParams
    ): Promise<AuthenticationModel> {
      const authenticationModel = {
        accessToken: 'authToken',
        name: 'john foo bar'
      }
      return authenticationModel
    }
  }

  return new AuthenticationSub()
}
