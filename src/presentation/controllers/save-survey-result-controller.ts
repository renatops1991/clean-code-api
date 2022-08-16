import { Controller, HttpResponse } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'
import { LoadAnswersBySurvey, SaveSurveyResult } from '@/domain/usecases'
import {
  forbidden,
  serverError,
  success
} from '@/presentation/helpers/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request
      const existsSurvey = await this.loadAnswersBySurvey.loadAnswers(surveyId)

      if (!existsSurvey.length) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyAnswers = existsSurvey.map((answer) => answer)
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

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}
