import { Authentication, AuthenticationParams } from '../../controllers/login/signin/singin-controller-protocols'

export const mockAuthentication = (): Authentication => {
  class AuthenticationSub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return 'authToken'
    }
  }

  return new AuthenticationSub()
}
