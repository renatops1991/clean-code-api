import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it('Should return an account on add success', async () => {
    const sut = makeSut()
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
  it('Should return ana account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'john foo bar',
      email: 'johnfoobar@mail.com',
      password: 'password'
    })
    const account = await sut.loadByEmail('johnfoobar@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('john foo bar')
    expect(account.email).toBe('johnfoobar@mail.com')
    expect(account.password).toBe('password')
  })
  it('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const resultAccount = await sut.loadByEmail('johnfoobar@mail.com')
    expect(resultAccount).toBeFalsy()
  })
  it('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const insertAccount = await accountCollection.insertOne({
      name: 'john foo bar',
      email: 'johnfoobar@mail.com',
      password: 'password'
    })
    const responseAccount = await accountCollection.findOne({ _id: insertAccount.insertedId })
    expect(responseAccount.accessToken).toBeFalsy()
    await sut.updateAccessToken(responseAccount._id, 'fooToken')
    const account = await accountCollection.findOne({ _id: responseAccount._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('fooToken')
  })
})
