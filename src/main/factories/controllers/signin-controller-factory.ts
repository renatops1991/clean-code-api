import { makeLoginValidation } from './signin-validation'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication } from '@/main/factories/usescases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import { SignInController } from '@/presentation/controllers/signin-controller'

export const makeSignInController = (): Controller => {
  const signInController = new SignInController(
    makeDbAuthentication(),
    makeLoginValidation()
  )
  return makeLogControllerDecorator(signInController)
}
