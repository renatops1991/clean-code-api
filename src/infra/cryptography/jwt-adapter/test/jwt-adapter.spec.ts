import { JwtAdapter } from '../jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('token')
  },
  async verify (): Promise<string> {
    return await Promise.resolve('foo')
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}
describe('Jwt Adapter', () => {
  describe('encrypt', () => {
    it('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('foo')
      expect(signSpy).toHaveBeenCalledWith({ id: 'foo' }, 'secret')
    })
    it('Should return a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('foo')
      expect(accessToken).toBe('token')
    })
    it('Should throw exception if sign throws error', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const expectedPromise = sut.encrypt('foo')
      await expect(expectedPromise).rejects.toThrow()
    })
  })

  describe('verify', () => {
    it('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('token')
      expect(verifySpy).toHaveBeenCalledWith('token', 'secret')
    })
    it('Should return a value on verify success', async () => {
      const sut = makeSut()
      const expectedResponse = await sut.decrypt('token')
      expect(expectedResponse).toBe('foo')
    })
    it('Should throw exception if verify throws error', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify')
        .mockImplementationOnce(() => { throw new Error() })
      const expectedResponse = sut.decrypt('token')
      await expect(expectedResponse).rejects.toThrow()
    })
  })
})
