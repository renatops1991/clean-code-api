import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashPassword'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('hashPassword')
    expect(hashSpy).toHaveBeenLastCalledWith('hashPassword', salt)
  })
  it('Should return a hash on success', async () => {
    const sut = makeSut()
    const expectHash = await sut.encrypt('hashPassword')
    expect(expectHash).toBe('hashPassword')
  })
})
