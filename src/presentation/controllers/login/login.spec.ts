import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

interface sutTypes{
  sut: LoginController
}

const makeSut = (): sutTypes => {
  const sut = new LoginController()
  return { sut }
}

describe('LoginController', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should returns 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'john@foobar.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
