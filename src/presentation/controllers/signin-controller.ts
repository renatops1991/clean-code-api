import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import {
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/presentation/helpers/http-helper'
import { Authentication } from '@/domain/usecases/authentication'

export class SignInController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: SignInController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
      const authenticationModel = await this.authentication.auth({
        email,
        password
      })
      if (!authenticationModel) {
        return unauthorized()
      }
      return success(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignInController {
  export type Request = {
    email: string
    password: string
  }
}
