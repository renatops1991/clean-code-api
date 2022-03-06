import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeAdbAddSurvey } from '../../usescases/add-survey/db-survey-factory'
import { makeAddSurveyValidation } from './survey-validation'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeAdbAddSurvey())
  return makeLogControllerDecorator(controller)
}
