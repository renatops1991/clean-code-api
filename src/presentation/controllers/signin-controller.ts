import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@/presentation/protocols'
import {
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/presentation/helpers/http/http-helper'
import { Authentication } from '@/domain/usecases/authentication'

export class SigninController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const authenticationModel = await this.authentication.auth({ email, password })
      if (!authenticationModel) {
        return unauthorized()
      }
      return success(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
