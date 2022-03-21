import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}
describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  describe('add', () => {
    it('Should return an survey on add success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'foo?',
        answers: [{
          answer: 'bar',
          image: '/images/foo'
        },
        {
          answer: 'xis?'
        }],
        date: new Date()
      })
      const expectedSurvey = await surveyCollection.findOne({ question: 'foo?' })
      expect(expectedSurvey).toBeTruthy()
    })
  })
})
