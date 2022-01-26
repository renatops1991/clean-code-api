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
    await sut.hash('hashPassword')
    expect(hashSpy).toHaveBeenLastCalledWith('hashPassword', salt)
  })
  it('Should return a hash on success', async () => {
    const sut = makeSut()
    const expectHash = await sut.hash('hashPassword')
    expect(expectHash).toBe('hashPassword')
  })
  it('Should pass exception if bcrypt throw exception', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const expectedPromise = sut.hash('hashPassword')
    await expect(expectedPromise).rejects.toThrow()
  })
})
