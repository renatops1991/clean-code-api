export interface Encrypted{
  encrypt (value: string): Promise<string>
}
