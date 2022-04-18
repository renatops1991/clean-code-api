export interface Decrypted {
  decrypt(token: string): Promise<string>
}
