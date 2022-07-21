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
    answers: [
      {
        image: '/image/foo.jpg',
        answer: 'bar'
      },
      {
        answer: 'xis?'
      },
      {
        answer: 'foo'
      }
    ],
    createdAt: new Date()
  })

  const result = await surveyCollection.findOne({
    _id: surveyResult.insertedId
  })

  return MongoHelper.map(result)
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
      const account = await makeFakeAccount()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        createdAt: new Date()
      })
      const expectedSurveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id
      })

      expect(expectedSurveyResult).toBeTruthy()
    })

    it('Should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeFakeAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        createdAt: new Date()
      })

      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        createdAt: new Date()
      })

      const updateSurveyResult = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId: account.id
        })
        .toArray()

      expect(updateSurveyResult).toBeTruthy()
      expect(updateSurveyResult.length).toBe(1)
    })
  })

  describe('LoadBySurveyId', () => {
    it('Should load survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeFakeAccount()
      const otherAccount = await makeFakeAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          createdAt: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          createdAt: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          createdAt: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          createdAt: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(otherAccount.id),
          answer: survey.answers[0].answer,
          createdAt: new Date()
        }
      ])

      const sut = makeSut()
      const expectedResult = await sut.loadBySurveyId(survey.id, account.id)

      expect(expectedResult).toBeTruthy()
      expect(expectedResult.surveyId).toEqual(survey.id)
      expect(expectedResult.answers[0].count).toBe(3)
      expect(expectedResult.answers[0].percent).toBe(60)
      expect(expectedResult.answers[0].isCurrentAccountAnswer).toBeTruthy()
      expect(expectedResult.answers[1].count).toBe(2)
      expect(expectedResult.answers[1].percent).toBe(40)
      expect(expectedResult.answers[1].isCurrentAccountAnswer).toBeTruthy()
      expect(expectedResult.answers[2].count).toBe(0)
      expect(expectedResult.answers[2].percent).toBe(0)
      expect(expectedResult.answers[2].isCurrentAccountAnswer).toBeFalsy()
    })

    it('Should return null if there is no survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeFakeAccount()
      const sut = makeSut()
      const expectedSurveyResult = await sut.loadBySurveyId(survey.id, account.id)
      expect(expectedSurveyResult).toBeNull()
    })
  })
})
