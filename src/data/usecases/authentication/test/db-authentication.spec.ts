import { DbAuthentication } from '../db-authentication'
import {
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypted,
  UpdateAccessTokenRepository
} from '../db-authentication-protocols'
import { throwError, fixturesAuthentication } from '@/domain/fixtures'
import {
  mockHashComparer,
  mockEncrypted,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository
} from '@/../tests/data/mocks'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encryptedStub: Encrypted
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encryptedStub = mockEncrypted()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encryptedStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encryptedStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository HashComparer with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(fixturesAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('john@example.com')
  })
  it('Should throws exception if LoadAccountEmailRepository throws error', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const expectedPromise = sut.auth(fixturesAuthentication())
    await expect(expectedPromise).rejects.toThrow()
  })
  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const model = await sut.auth(fixturesAuthentication())
    expect(model).toBeNull()
  })
  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(fixturesAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('foo', 'hashPassword')
  })
  it('Should throws exception if HashComparer throws error', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
    const expectedPromise = sut.auth(fixturesAuthentication())
    await expect(expectedPromise).rejects.toThrow()
  })
  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const model = await sut.auth(fixturesAuthentication())
    expect(model).toBeNull()
  })
  it('Should call Encrypted with correct id', async () => {
    const { sut, encryptedStub } = makeSut()
    const encryptSpy = jest.spyOn(encryptedStub, 'encrypt')
    await sut.auth(fixturesAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith('foo')
  })
  it('Should throw exception if Encrypted throws error', async () => {
    const { sut, encryptedStub } = makeSut()
    jest.spyOn(encryptedStub, 'encrypt').mockImplementationOnce(throwError)
    const expectedPromise = sut.auth(fixturesAuthentication())
    await expect(expectedPromise).rejects.toThrow()
  })
  it('Should return an authentication model on success', async () => {
    const { sut } = makeSut()
    const { accessToken, name } = await sut.auth(fixturesAuthentication())
    expect(accessToken).toBe('foo')
    expect(name).toBe('john foo bar')
  })
  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(fixturesAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('foo', 'foo')
  })
  it('Should throw exception if UpdateAccessTokenRepository throws error', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
    const expectedPromise = sut.auth(fixturesAuthentication())
    await expect(expectedPromise).rejects.toThrow()
  })
})
