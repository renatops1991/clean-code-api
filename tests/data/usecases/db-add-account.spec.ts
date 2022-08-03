import { DbAddAccount } from '@/data/usecases/db-add-account'
import { Hashed } from '@/data/protocols/cryptography/hashed'
import {
  AddAccountRepository,
  CheckAccountByEmailRepository
} from '@/data/protocols'
import {
  fixturesAddAccountParams,
  throwError
} from '@/tests/domain/fixtures'
import {
  mockHashed,
  mockAddAccountRepository,
  mockCheckAccountByEmailRepository
} from '../mocks'

type SutTypes = {
  sut: DbAddAccount
  hashStub: Hashed
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hashStub = mockHashed()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository()
  const sut = new DbAddAccount(
    hashStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  )
  return {
    sut,
    hashStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
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
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
    await sut.add(fixturesAddAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('john@foobar.com')
  })
  it('Should return false if CheckAccountByEmailRepository return an account', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
      .mockReturnValueOnce(Promise.resolve(true))
    const isValid = await sut.add(fixturesAddAccountParams())
    expect(isValid).toBeFalsy()
  })
})
