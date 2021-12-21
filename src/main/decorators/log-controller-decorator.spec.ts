import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
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

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
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
})
