import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}
describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
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

  describe('loadAll', () => {
    it('Should load all surveys on success', async () => {
      await surveyCollection.insertOne({
        question: 'foo',
        answers: [{
          image: 'https://image.com/foo.jpg',
          answer: 'bar'
        }],
        date: new Date()
      })
      const sut = makeSut()
      const surveysList = await sut.loadAll()
      expect(surveysList.length).toBe(1)
      expect(surveysList[0].question).toBe('foo')
    })
  })
})
