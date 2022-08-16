import { SaveSurveyResultController } from '@/presentation/controllers/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbSaveSurveyResult } from '@/main/factories/usescases/survey-result/db-save-survey-result'
import { makeDbLoadAnswersBySurvey } from '@/main/factories/usescases/survey/db-survey-factory'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadAnswersBySurvey(),
    makeDbSaveSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
