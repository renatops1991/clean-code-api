import { SurveyMongoRepository } from '../survey-mongo-repository'
import { MongoHelper } from '../../helpers/mongo-helper'
import { AccountModel } from '@/domain/models/account'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { fixturesSurveyParams } from '@/domain/fixtures'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeAccount = async (): Promise<AccountModel> => {
  const account = await accountCollection.insertOne({
    name: 'foo',
    email: 'foo@foo.com',
    password: 'foo'
  })

  const accountResult = await accountCollection.findOne({
    _id: account.insertedId
  })
  return MongoHelper.map(accountResult)
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
    surveyResultCollection = await MongoHelper.getCollection('surveysResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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
      const account = await makeFakeAccount()
      const addSurveyModels = [fixturesSurveyParams(), fixturesSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = await surveyCollection.findOne({
        _id: result.insertedIds[0]
      })
      await surveyResultCollection.insertOne({
        surveyId: result.insertedIds[0],
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveysList = await sut.loadAll(account.id)
      expect(surveysList.length).toBe(2)
      expect(surveysList[0].id).toBeTruthy()
      expect(surveysList[0].question).toBe(addSurveyModels[0].question)
      expect(surveysList[0].didAnswer).toBeTruthy()
      expect(surveysList[1].question).toBe(addSurveyModels[1].question)
      expect(surveysList[1].didAnswer).toBeFalsy()
    })
    it('Should return empty list', async () => {
      const sut = makeSut()
      const account = await makeFakeAccount()
      const surveysList = await sut.loadAll(account.id)
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
