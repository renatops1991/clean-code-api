import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account  on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'john foo bar',
      email: 'johnfoobar@mail.com',
      password: 'password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('john foo bar')
    expect(account.email).toBe('johnfoobar@mail.com')
    expect(account.password).toBe('password')
  })
})
