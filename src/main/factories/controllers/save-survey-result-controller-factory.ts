import { SaveSurveyResultController } from '@/presentation/controllers/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbSaveSurveyResult } from '@/main/factories/usescases/survey-result/db-save-survey-result'
import { makeDbLoadSurveyById } from '@/main/factories/usescases/survey/db-survey-factory'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
