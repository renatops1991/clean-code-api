import { NextFunction, Request, Response } from 'express'
import { HttpRequest, Middleware } from '../../presentation/protocols'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: request.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body)
      next()
    } else {
      response.status(httpResponse.statusCode).json({
        status: httpResponse.statusCode,
        message: httpResponse.body.message
      })
    }
  }
}
