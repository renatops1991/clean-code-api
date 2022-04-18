export interface Hashed {
  hash(value: string): Promise<string>
}
