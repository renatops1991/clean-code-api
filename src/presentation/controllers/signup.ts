import { MissingParamError } from '../errors/missing-param-error'
import { HttpResponse, HttpRequest } from '../protocols/http'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        body: new MissingParamError('name'),
        statusCode: 400
      }
    }

    if (!httpRequest.body.email) {
      return {
        body: new MissingParamError('email'),
        statusCode: 400
      }
    }
  }
}
