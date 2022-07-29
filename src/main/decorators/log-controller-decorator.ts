
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (request: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
