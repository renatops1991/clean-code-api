
import { DbLoadAccountByToken } from '../db-load-account-by-token'
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository
} from '../db-account-protocols'
import { mockAccountModel, throwError } from '@/domain/mocks'
import { mockDecrypted } from '@/data/mocks'

type SutTypes = {
  sut: DbLoadAccountByToken
  decryptedStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const decryptedStub = mockDecrypted()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decryptedStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decryptedStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  it('Should call Decrypter with correct values', async () => {
    const { sut, decryptedStub } = makeSut()
    const decryptSpy = jest.spyOn(decryptedStub, 'decrypt')
    await sut.load('fooToken', 'fooRole')
    expect(decryptSpy).toHaveBeenCalledWith('fooToken')
  })
  it('Should return null if Decrypter returns null', async () => {
    const { sut, decryptedStub } = makeSut()
    jest.spyOn(decryptedStub, 'decrypt')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
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
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const expectedAccount = await sut.load('fooToken', 'fooRole')
    expect(expectedAccount).toBeNull()
  })
  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const expectedAccount = await sut.load('fooToken', 'fooRole')
    expect(expectedAccount).toEqual(mockAccountModel())
  })
  it('Should throw if Decrypter throws', async () => {
    const { sut, decryptedStub } = makeSut()
    jest.spyOn(decryptedStub, 'decrypt')
      .mockImplementationOnce(throwError)
    const expectedPromise = sut.load('fooToken', 'fooRole')
    await expect(expectedPromise).rejects.toThrow()
  })
  it('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(throwError)
    const expectedPromise = sut.load('fooToken', 'fooRole')
    await expect(expectedPromise).rejects.toThrow()
  })
})
