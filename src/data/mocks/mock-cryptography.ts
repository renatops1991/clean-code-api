import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Hasher } from '@/data/protocols/criptography/hasher'

export const mockHashed = (): Hasher => {
  class HashStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashPassword'))
    }
  }
  return new HashStub()
}

export const mockDecrypted = (): Decrypter => {
  class DecryptedStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return await new Promise(resolve => resolve('fooToken'))
    }
  }
  return new DecryptedStub()
}

export const mockEncrypted = (): Encrypter => {
  class EncryptedStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await new Promise(resolve => resolve('foo'))
    }
  }
  return new EncryptedStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}
