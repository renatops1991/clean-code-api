import { makeSignUpValidation } from './signup-validation'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication } from '@/main/factories/usescases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usescases/account/db-account-factory'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'

export const makeSignupController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(signUpController)
}
