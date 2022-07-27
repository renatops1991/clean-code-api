import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import {
  forbidden,
  serverError,
  success
} from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyAnswers = survey.answers.map((answer) => answer.answer)
      if (!surveyAnswers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        createdAt: new Date()
      })

      return success(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
