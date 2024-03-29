
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { fixturesAccountModel } from '@/tests/domain/fixtures'
import { mockLogErrorRepository } from '../../data/mocks/mock-db-log'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      return await Promise.resolve(success(fixturesAccountModel()))
    }
  }
  return new ControllerStub()
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'foo'
  return serverError(fakeError)
}

const fixtureRequest = (): any => ({
  name: 'john foo bar',
  email: 'john@foobar.com',
  password: 'foo',
  passwordConfirmation: 'foo'

})

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
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
    await sut.handle(fixtureRequest())
    expect(handleSpy).toHaveBeenCalledWith(fixtureRequest())
  })
  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httResponse = await sut.handle(fixtureRequest())
    expect(httResponse).toEqual(success(fixturesAccountModel()))
  })
  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
    await sut.handle(fixtureRequest())
    expect(logSpy).toHaveBeenCalledWith('foo')
  })
})
