import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken UseCase', () => {
  it('Should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (token: string): Promise<string> {
        return await new Promise(resolve => resolve('fooToken'))
      }
    }
    const decrypterStub = new DecrypterStub()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const sut = new DbLoadAccountByToken(decrypterStub)
    await sut.load('fooToken')
    expect(decryptSpy).toHaveBeenCalledWith('fooToken')
  })
})
