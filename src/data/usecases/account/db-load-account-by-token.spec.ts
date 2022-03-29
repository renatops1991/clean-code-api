
import { DbLoadAccountByToken } from './db-load-account-by-token'
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository
} from './db-account-protocols'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'foo',
  name: 'John Foo bar',
  email: 'john@example.com',
  password: 'hashFoo'
})

const makeDbLoadAccountByToken = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return await new Promise(resolve => resolve('fooToken'))
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDbLoadAccountByToken()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('fooToken', 'fooRole')
    expect(decryptSpy).toHaveBeenCalledWith('fooToken')
  })
  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
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
    expect(expectedAccount).toEqual(makeFakeAccount())
  })
  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const expectedPromise = sut.load('fooToken', 'fooRole')
    await expect(expectedPromise).rejects.toThrow()
  })
  it('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const expectedPromise = sut.load('fooToken', 'fooRole')
    await expect(expectedPromise).rejects.toThrow()
  })
})
