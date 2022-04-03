import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyResult = await surveyCollection.insertOne({
    question: 'foo',
    answers: [{
      image: '/image/foo.jpg',
      answer: 'bar'
    }],
    createdAt: new Date()
  })

  const result = await surveyCollection.findOne({ _id: surveyResult.insertedId })

  return MongoHelper.map(result)
}

const makeAccount = async (): Promise<AccountModel> => {
  const account = await accountCollection.insertOne({
    name: 'foo',
    email: 'foo@foo.com',
    password: 'foo'
  })

  const accountResult = await accountCollection.findOne({ _id: account.insertedId })
  return MongoHelper.map(accountResult)
}

describe('SurveyResultMongoRepository', () => {
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
  describe('save', () => {
    it('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        createdAt: new Date()
      })

      const expectedSurveyResult = await surveyResultCollection.findOne({
        accountId: account.id,
        surveyId: survey.id
      })

      expect(expectedSurveyResult).toBeTruthy()
      expect(MongoHelper.map(expectedSurveyResult).id).toBeTruthy()
      expect(expectedSurveyResult.answer).toEqual(survey.answers[0].answer)
    })
  })
})
