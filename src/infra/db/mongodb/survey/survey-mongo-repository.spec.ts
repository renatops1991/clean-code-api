import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
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
        createdAt: new Date()
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
      expect(surveysList[0].id).toBeTruthy()
      expect(surveysList[0].question).toBe('foo')
    })
    it('Should return empty list', async () => {
      const sut = makeSut()
      const surveysList = await sut.loadAll()
      expect(surveysList.length).toBe(0)
    })
  })

  describe('loadById', () => {
    it('Should load survey by id on success', async () => {
      const createdSurvey = await surveyCollection.insertOne({
        question: 'foo',
        answers: [{
          image: 'https://image.com/foo.jpg',
          answer: 'bar'
        }],
        date: new Date()
      })

      const surveyResult = await surveyCollection.findOne({ _id: createdSurvey.insertedId })
      const sut = makeSut()
      const survey = await sut.loadById(MongoHelper.map(surveyResult).id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
