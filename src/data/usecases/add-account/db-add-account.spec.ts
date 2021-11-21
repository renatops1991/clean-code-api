import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashPassword'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'foo',
        name: 'john foo bar',
        email: 'john@foobar.com',
        password: 'hashPassword'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}
describe('DbAddAccount UseCase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenLastCalledWith('validPassword')
  })
  it('Should pass the exception if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'validPassword'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  it('Should call AddAccountRepository with correct parameters', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'hashPassword'
    })
  })
  it('Should pass the exception if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'validPassword'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'validPassword'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'foo',
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'hashPassword'
    })
  })
})
