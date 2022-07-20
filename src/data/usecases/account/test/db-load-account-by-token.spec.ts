
import { DbLoadAccountByToken } from '../db-load-account-by-token'
import {
  Decrypted,
  LoadAccountByTokenRepository
} from '../db-account-protocols'
import { fixturesAccountModel, throwError } from '@/domain/fixtures'
import { mockDecrypted, mockLoadAccountByTokenRepository } from '@/data/mocks'

type SutTypes = {
  sut: DbLoadAccountByToken
  decryptedStub: Decrypted
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decryptedStub = mockDecrypted()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decryptedStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decryptedStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  it('Should call Decrypted with correct values', async () => {
    const { sut, decryptedStub } = makeSut()
    const decryptSpy = jest.spyOn(decryptedStub, 'decrypt')
    await sut.load('fooToken', 'fooRole')
    expect(decryptSpy).toHaveBeenCalledWith('fooToken')
  })
  it('Should return null if Decrypted returns null', async () => {
    const { sut, decryptedStub } = makeSut()
    jest.spyOn(decryptedStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(null))
    const expectedAccount = await sut.load('fooToken', 'fooRole')
    expect(expectedAccount).toBeNull()
  })
  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('fooToken', 'fooRole')
    expect(loadByTokenSpy).toHaveBeenCalledWith('fooToken', 'fooRole')
  })
  it('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const expectedAccount = await sut.load('fooToken', 'fooRole')
    expect(expectedAccount).toBeNull()
  })
  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const expectedAccount = await sut.load('fooToken', 'fooRole')
    expect(expectedAccount).toEqual(fixturesAccountModel())
  })
  it('Should throw if Decrypted throws', async () => {
    const { sut, decryptedStub } = makeSut()
    jest.spyOn(decryptedStub, 'decrypt')
      .mockImplementationOnce(throwError)
    const expectedPromise = await sut.load('fooToken', 'fooRole')
    expect(expectedPromise).toBeNull()
  })
  it('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(throwError)
    const expectedPromise = sut.load('fooToken', 'fooRole')
    await expect(expectedPromise).rejects.toThrow()
  })
})
