import { makeLoginValidation } from './signin-validation'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/login/signin/signin-controller'
import { makeDbAuthentication } from '@/main/factories/usescases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  )
  return makeLogControllerDecorator(loginController)
}
