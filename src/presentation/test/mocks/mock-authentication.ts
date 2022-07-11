import {
  Authentication,
  AuthenticationParams,
  AuthenticationModel
} from '../../controllers/login/signin/signin-controller-protocols'

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
