import {
  AccountModel,
  AddAccountParams,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '../db-account-protocols'
import { DbAddAccount } from '../db-add-account'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/mocks'
import { mockHashed } from '@/data/mocks'

type SutTypes = {
  sut: DbAddAccount
  hashStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hashStub = mockHashed()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hashStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hashStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}
describe('DbAddAccount UseCase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hashStub } = makeSut()
    const encryptSpy = jest.spyOn(hashStub, 'hash')
    await sut.add(mockAddAccountParams())
    expect(encryptSpy).toHaveBeenLastCalledWith('validPassword')
  })
  it('Should pass the exception if Hasher throws', async () => {
    const { sut, hashStub } = makeSut()
    jest.spyOn(hashStub, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
  it('Should call AddAccountRepository with correct parameters', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'hashPassword'
    })
  })
  it('Should pass the exception if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(mockAccountModel())
  })
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAddAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('john@foobar.com')
  })
  it('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(mockAccountModel())))
    const account = await sut.add(mockAccountModel())
    expect(account).toBeNull()
  })
})
