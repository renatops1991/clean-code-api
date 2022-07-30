import { Authentication } from '@/domain/usecases/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationSub implements Authentication {
    async auth (
      authentication: Authentication.Params
    ): Promise<Authentication.Result> {
      const authenticationModel = {
        accessToken: 'authToken',
        name: 'john foo bar'
      }
      return authenticationModel
    }
  }

  return new AuthenticationSub()
}
