import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { setUpApp } from '@/main/config/app'
import env from '@/main/config/env'
import { Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Express } from 'express'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection
let app: Express

const makeAccessToken = async (): Promise<string> => {
  const password = await hash('123', 12)
  const account = await accountCollection.insertOne({
    name: 'john foo bar',
    email: 'john@bar.com',
    password
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

describe('SaveSurveyResult Routes', () => {
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
    surveyResultCollection = MongoHelper.getCollection('surveysResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('UpdateSurveyResult', () => {
    it('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/foo/results')
        .send({
          answer: 'foo'
        })
        .expect(403)
    })
    it('Should return 200 on success', async () => {
      const accessToken = await makeAccessToken()
      const survey = await surveyCollection.insertOne({
        question: 'foo',
        answers: [{
          answer: 'foo',
          image: '/image/foo.jpg'
        }, {
          answer: 'xis'
        }],
        createdAt: new Date()
      })

      const surveyId = await surveyCollection.findOne({ _id: survey.insertedId })
      await request(app)
        .put(`/api/surveys/${surveyId._id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'foo'
        })
        .expect(200)
    })
  })

  describe('FindSurveyResult', () => {
    it('Should return 403 on load survey result without access Token', async () => {
      await request(app)
        .get('/api/surveys/foo/results')
        .expect(403)
    })
    it('Should return 200 on load survey result with access Token', async () => {
      const accessToken = await makeAccessToken()
      const survey = await surveyCollection.insertOne({
        question: 'foo',
        answers: [{
          answer: 'foo',
          image: '/image/foo.jpg'
        }, {
          answer: 'xis'
        }],
        createdAt: new Date()
      })

      const surveyId = await surveyCollection.findOne({ _id: survey.insertedId })
      await request(app)
        .get(`/api/surveys/${surveyId._id}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
