import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load0survey-result-controller-factory'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { userAuth } from '@/main/middlewares/authentication'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', userAuth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', userAuth, adaptRoute(makeLoadSurveyResultController()))
}
