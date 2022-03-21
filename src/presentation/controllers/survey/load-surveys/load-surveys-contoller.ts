import { serverError, success } from '../../../helpers/http/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  LoadSurveys
} from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return success(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
