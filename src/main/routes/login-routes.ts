import { Router } from 'express'
import { makeSignupController } from '../factories/signup/signup'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
