import { LoadSurveyResultController } from '@/presentation/controllers//load-survey-result-controller'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbCheckSurveyById } from '@/main/factories/usescases/survey/db-survey-factory'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveyResult } from '@/main/factories/usescases/survey-result/db-load-survey-result'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbCheckSurveyById(),
    makeDbLoadSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
