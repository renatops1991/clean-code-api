import { DbAddAccount } from './db-add-account'
describe('DbAddAccount UseCase', () => {
  it('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise((resolve) => resolve('hashPassword'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'john foo bar',
      email: 'john@foobar.com',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenLastCalledWith('validPassword')
  })
})
