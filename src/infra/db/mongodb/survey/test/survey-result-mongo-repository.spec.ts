import { SurveyResultMongoRepository } from '../survey-result-mongo-repository'
import { MongoHelper } from '../../helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'

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
    },
    {
      answer: 'xis?'
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
      const expectedSurveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        createdAt: new Date()
      })

      expect(expectedSurveyResult).toBeTruthy()
      expect(expectedSurveyResult.surveyId).toEqual(survey.id)
      expect(expectedSurveyResult.answers[0].count).toBe(1)
      expect(expectedSurveyResult.answers[0].percent).toBe(100)
    })

    it('Should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        createdAt: new Date()
      })

      const sut = makeSut()
      const updateSurveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        createdAt: new Date()
      })

      expect(updateSurveyResult.surveyId).toEqual(survey.id)
      expect(updateSurveyResult.answers[0].answer).toEqual(survey.answers[1].answer)
      expect(updateSurveyResult.answers[0].count).toBe(1)
      expect(updateSurveyResult.answers[0].percent).toBe(100)
    })
  })
})
