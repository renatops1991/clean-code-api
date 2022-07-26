import { adaptRoute } from '@/main/adapters/express-route-adapter'
import {
  makeLoginController,
  makeSignupController
} from '@/main/factories/controllers'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
