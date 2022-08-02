import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'
import { fixturesAddAccountParams } from '@/tests/domain/fixtures/fixtures-account'

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

  describe('add', () => {
    it('Should return an account on add success', async () => {
      const sut = makeSut()
      const isValid = await sut.add(fixturesAddAccountParams())
      expect(isValid).toBeTruthy()
    })
  })

  describe('loadByEmail', () => {
    it('Should return ana account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(fixturesAddAccountParams())
      const account = await sut.loadByEmail('john@foobar.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('john foo bar')
      expect(account.password).toBe('hashPassword')
    })
    it('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const resultAccount = await sut.loadByEmail('john@foobar.com')
      expect(resultAccount).toBeFalsy()
    })
  })
  describe('updateAccessToken', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const insertAccount = await accountCollection.insertOne(
        fixturesAddAccountParams()
      )
      const responseAccount = await accountCollection.findOne({
        _id: insertAccount.insertedId
      })
      expect(responseAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(responseAccount._id, 'fooToken')
      const account = await accountCollection.findOne({
        _id: responseAccount._id
      })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('fooToken')
    })
  })
  describe('loadByToken', () => {
    it('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'john foo bar',
        email: 'johnfoobar@mail.com',
        password: 'password',
        accessToken: 'fooToken'
      })
      const account = await sut.loadByToken('fooToken')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })
    it('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'john foo bar',
        email: 'johnfoobar@mail.com',
        password: 'password',
        accessToken: 'fooToken',
        role: 'admin'
      })
      const account = await sut.loadByToken('fooToken', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })
    it('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'john foo bar',
        email: 'johnfoobar@mail.com',
        password: 'password',
        accessToken: 'fooToken'
      })
      const account = await sut.loadByToken('fooToken', 'admin')
      expect(account).toBeFalsy()
    })
    it('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'john foo bar',
        email: 'johnfoobar@mail.com',
        password: 'password',
        accessToken: 'fooToken',
        role: 'admin'
      })
      const account = await sut.loadByToken('fooToken')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })
    it('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('fooToken')
      expect(account).toBeFalsy()
    })
  })
})
