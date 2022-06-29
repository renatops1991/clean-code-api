import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

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
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveysResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
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
  })
})
