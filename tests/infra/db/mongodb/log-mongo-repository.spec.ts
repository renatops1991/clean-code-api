import { LogMongoRepository } from '@/infra/db/mongodb/log-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}
describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  it('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('foo')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
