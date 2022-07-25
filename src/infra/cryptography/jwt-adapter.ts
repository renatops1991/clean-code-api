import { Decrypted } from '@/data/protocols/cryptography/decrypted'
import { Encrypted } from '@/data/protocols/cryptography/encrypted'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypted, Decrypted {
  constructor (private readonly secret: string) {}
  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secret)
    return value
  }
}
