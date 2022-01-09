import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

describe('LoginController', () => {
  it('Should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should returns 400 if no password is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        email: 'john@foobar.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
