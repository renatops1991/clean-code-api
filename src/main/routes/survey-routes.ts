import { adaptRoute } from '@/main/adapters/express-route-adapter'
import {
  makeAddSurveyController,
  makeLoadSurveysController
} from '@/main/factories/controllers/survey-controller-factory'
import { adminAuth, userAuth } from '@/main/middlewares/authentication'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveysController()))
}
