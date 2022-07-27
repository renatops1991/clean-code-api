import { makeLoginValidation } from './signin-validation'
import { Controller } from '@/presentation/protocols'
import { SigninController } from '@/presentation/controllers/signin-controller'
import { makeDbAuthentication } from '@/main/factories/usescases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'

export const makeSigninController = (): Controller => {
  const signinController = new SigninController(
    makeDbAuthentication(),
    makeLoginValidation()
  )
  return makeLogControllerDecorator(signinController)
}
