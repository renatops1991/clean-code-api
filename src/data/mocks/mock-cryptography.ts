import { Decrypted } from '@/data/protocols/criptography/decrypted'
import { Encrypted } from '@/data/protocols/criptography/encrypted'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Hashed } from '@/data/protocols/criptography/hashed'

export const mockHashed = (): Hashed => {
  class HashStub implements Hashed {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashPassword'))
    }
  }
  return new HashStub()
}

export const mockDecrypted = (): Decrypted => {
  class DecryptedStub implements Decrypted {
    async decrypt (token: string): Promise<string> {
      return await new Promise(resolve => resolve('fooToken'))
    }
  }
  return new DecryptedStub()
}

export const mockEncrypted = (): Encrypted => {
  class EncryptedStub implements Encrypted {
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
