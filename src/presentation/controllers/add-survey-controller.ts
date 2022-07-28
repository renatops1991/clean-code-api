import { badRequest, serverError, noContent } from '@/presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@/presentation/protocols'
import { AddSurvey } from '@/domain/usecases/add-survey'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers,
        createdAt: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}