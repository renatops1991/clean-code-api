import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const surveyResult = await this.loadSurveyById.loadById(surveyId)
    if (!surveyResult) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return null
  }
}
