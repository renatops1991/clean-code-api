import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'foo'
        }
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Controller Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httRequest = {
      body: {
        name: 'john foo bar',
        email: 'john@foobar.com',
        password: 'foo',
        passwordConfirmation: 'foo'
      }
    }
    await sut.handle(httRequest)
    expect(handleSpy).toHaveBeenCalledWith(httRequest)
  })
  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httRequest = {
      body: {
        name: 'john foo bar',
        email: 'john@foobar.com',
        password: 'foo',
        passwordConfirmation: 'foo'
      }
    }
    const httResponse = await sut.handle(httRequest)
    expect(httResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'foo'
      }
    })
  })
  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'foo'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const httRequest = {
      body: {
        name: 'john foo bar',
        email: 'john@foobar.com',
        password: 'foo',
        passwordConfirmation: 'foo'
      }
    }
    await sut.handle(httRequest)
    expect(logSpy).toHaveBeenCalledWith('foo')
  })
})
