import {

  HttpResponse,
  Middleware
} from '@/presentation/protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return success({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
