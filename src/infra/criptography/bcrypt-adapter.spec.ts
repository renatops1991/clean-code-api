import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashPassword'))
  }
}))
describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('hashPassword')
    expect(hashSpy).toHaveBeenLastCalledWith('hashPassword', salt)
  })
  it('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const expectHash = await sut.encrypt('hashPassword')
    expect(expectHash).toBe('hashPassword')
  })
})
