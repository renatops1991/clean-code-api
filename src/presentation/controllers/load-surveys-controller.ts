import { HttpResponse, Controller } from '@/presentation/protocols'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import {
  noContent,
  serverError,
  success
} from '@/presentation/helpers/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      return surveys.length ? success(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
