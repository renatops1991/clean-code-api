import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController, makeLoadSurveysController } from '../factories/controllers/survey/survey-controller-factory'
import { adminAuth, userAuth } from '../middlewares/authentication'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveysController()))
}
