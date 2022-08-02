import { DbAddAccount } from '@/data/usecases/db-add-account'
import { Hashed } from '@/data/protocols/cryptography/hashed'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import {
  fixturesAccountModel,
  fixturesAddAccountParams,
  throwError
} from '@/tests/domain/fixtures'
import {
  mockHashed,
  mockAddAccountRepository,
  mockLoadAccountByEmailRepository
} from '../mocks'

type SutTypes = {
  sut: DbAddAccount
  hashStub: Hashed
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hashStub = mockHashed()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest
    .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValue(Promise.resolve(null))
  const sut = new DbAddAccount(
    hashStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )
  return {
    sut,
    hashStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}
describe('DbAddAccount UseCase', () => {
  it('Should call Hashed with correct password', async () => {
    const { sut, hashStub } = makeSut()
    const encryptSpy = jest.spyOn(hashStub, 'hash')
    await sut.add(fixturesAddAccountParams())
    expect(encryptSpy).toHaveBeenLastCalledWith('hashPassword')
  })
  it('Should pass the exception if Hashed throws', async () => {
    const { sut, hashStub } = makeSut()
    jest.spyOn(hashStub, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(fixturesAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
  it('Should call AddAccountRepository with correct parameters', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(fixturesAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'hashPassword'
    })
  })
  it('Should pass the exception if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(throwError)
    const promise = sut.add(fixturesAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
  it('Should return true on success', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(fixturesAddAccountParams())
    expect(isValid).toBeTruthy()
  })
  it('Should return false if addAccountRepository returns false', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.resolve(false))
    const isValid = await sut.add(fixturesAddAccountParams())
    expect(isValid).toBeFalsy()
  })
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(fixturesAddAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('john@foobar.com')
  })
  it('Should return null if LoadAccountByEmailRepository return an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(fixturesAccountModel()))
    const isValid = await sut.add(fixturesAddAccountParams())
    expect(isValid).toBeFalsy()
  })
})
