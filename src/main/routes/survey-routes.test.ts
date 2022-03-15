
import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '../../main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('SurveyRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('Surveys', () => {
    it('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'foo?',
          answers: [{
            answer: 'bar',
            image: 'images/foo.jpg'
          }]
        }).expect(403)
    })
    it('Should return 204 on add survey with valid accessToken', async () => {
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
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'foo?',
          answers: [{
            answer: 'bar',
            image: 'images/foo.jpg'
          }]
        }).expect(204)
    })
  })
})
