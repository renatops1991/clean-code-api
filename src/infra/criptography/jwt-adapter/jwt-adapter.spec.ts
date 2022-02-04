import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('foo')
    expect(signSpy).toHaveBeenCalledWith({ id: 'foo' }, 'secret')
  })
})
