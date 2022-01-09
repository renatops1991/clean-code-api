import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      if (!email) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }

      if (!password) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }
      await this.authentication.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
