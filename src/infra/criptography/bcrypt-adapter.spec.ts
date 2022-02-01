import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashPassword'))
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  it('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('hashPassword')
    expect(hashSpy).toHaveBeenLastCalledWith('hashPassword', salt)
  })
  it('Should return a valid hash on hash success', async () => {
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
  it('Should call compare method with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('password', 'hashPassword')
    expect(compareSpy).toHaveBeenLastCalledWith('password', 'hashPassword')
  })
  it('Should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('password', 'hashPassword')
    expect(isValid).toBe(true)
  })
  it('Should return false when compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const isValid = await sut.compare('password', 'hashPassword')
    expect(isValid).toBe(false)
  })
})
