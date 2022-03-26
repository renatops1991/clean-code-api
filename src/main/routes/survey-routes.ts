import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories/controllers/survey/survey-controller-factory'
import { adminAuth, userAuth } from '@/main/middlewares/authentication'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveysController()))
}
