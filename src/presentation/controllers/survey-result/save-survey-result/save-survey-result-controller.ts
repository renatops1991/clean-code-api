import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const surveyResult = await this.loadSurveyById.loadById(surveyId)

      if (!surveyResult) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyAnswers = surveyResult.answers.map((answer) => answer.answer)
      if (!surveyAnswers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
