import { makeAddSurveyValidation } from './survey-validation'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-contoller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import {
  makeDbAddSurvey,
  makeDbLoadSurveys
} from '@/main/factories/usescases/survey/db-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  )
  return makeLogControllerDecorator(controller)
}

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
