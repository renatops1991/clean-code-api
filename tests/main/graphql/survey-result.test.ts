import { MongoHelper } from '@/infra/db/mongodb'
import { setUpApp } from '@/main/config/app'
import env from '@/main/config/env'
import { hash } from 'bcrypt'
import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

const makeAccessToken = async (): Promise<string> => {
  const password = await hash('123', 12)
  const account = await accountCollection.insertOne({
    name: 'john foo bar',
    email: 'john@bar.com',
    password,
    role: 'admin'
  })
  const id = account.insertedId
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    app = await setUpApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResult', () => {
    it('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()
      const currentDay = new Date()
      const createSurvey = await surveyCollection.insertOne({
        question: 'foo?',
        answers: [{
          answer: 'bar',
          image: 'images/foo.jpg'
        }, {
          answer: 'bar?'
        }],
        createdAt: currentDay
      })

      const survey = await surveyCollection.findOne({ _id: createSurvey.insertedId })

      const query = `query{
      surveyResult (surveyId: "${survey._id}") {
                question
                answers {
                    answer
                    image
                    count
                    percent
                    isCurrentAccountAnswer
                }
                createdAt
            }
        }`

      const expectedResponse = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      const expectedResponseBody = expectedResponse.body.data.surveyResult
      expect(expectedResponse.status).toBe(200)
      expect(expectedResponseBody.question).toEqual('foo?')
      expect(expectedResponseBody.createdAt).toBe(currentDay.toISOString())
      expect(expectedResponseBody.answers).toEqual([{
        answer: 'bar',
        image: 'images/foo.jpg',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }, {
        answer: 'bar?',
        image: null,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    it('Should return 403 on load survey result without accessToken', async () => {
      const createSurvey = await surveyCollection.insertOne({
        question: 'foo?',
        answers: [{
          answer: 'bar',
          image: 'images/foo.jpg'
        }, {
          answer: 'bar?'
        }],
        createdAt: new Date()
      })

      const survey = await surveyCollection.findOne({ _id: createSurvey.insertedId })

      const query = `query{
        surveyResult (surveyId: "${survey._id}") {
                  question
                  answers {
                      answer
                      image
                      count
                      percent
                      isCurrentAccountAnswer
                  }
                  createdAt
              }
          }`

      const expectedResponse = await request(app)
        .post('/graphql')
        .send({ query })

      expect(expectedResponse.status).toBe(403)
      expect(expectedResponse.body.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult', () => {
    it('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()
      const currentDay = new Date()
      const createSurvey = await surveyCollection.insertOne({
        question: 'foo?',
        answers: [{
          answer: 'bar',
          image: 'images/foo.jpg'
        }, {
          answer: 'foo'
        }],
        createdAt: currentDay
      })

      const survey = await surveyCollection.findOne({ _id: createSurvey.insertedId })

      const query = `mutation {
        saveSurveyResult (surveyId: "${survey._id}", answer: "${survey.answers[0].answer}") {
                  question
                  answers {
                      answer
                      image
                      count
                      percent
                      isCurrentAccountAnswer
                  }
                  createdAt
              }
          }`

      const expectedResponse = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      const expectedResponseBody = expectedResponse.body.data.saveSurveyResult
      expect(expectedResponse.status).toBe(200)
      expect(expectedResponseBody.question).toEqual('foo?')
      expect(expectedResponseBody.answers).toEqual([{
        answer: 'bar',
        image: 'images/foo.jpg',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      },
      {
        answer: 'foo',
        image: null,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    it('Should return 403 on save survey result without accessToken', async () => {
      const createSurvey = await surveyCollection.insertOne({
        question: 'foo?',
        answers: [{
          answer: 'bar',
          image: 'images/foo.jpg'
        }, {
          answer: 'foo'
        }],
        createdAt: new Date()
      })

      const survey = await surveyCollection.findOne({ _id: createSurvey.insertedId })

      const query = `mutation {
          saveSurveyResult (surveyId: "${survey._id}", answer: "${survey.answers[0].answer}") {
                    question
                    answers {
                        answer
                        image
                        count
                        percent
                        isCurrentAccountAnswer
                    }
                    createdAt
                }
            }`

      const expectedResponse = await request(app)
        .post('/graphql')
        .send({ query })

      expect(expectedResponse.status).toBe(403)
      expect(expectedResponse.body.errors[0].message).toBe('Access denied')
    })
  })
})
