
import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection

describe('SurveyRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })
  describe('Survey', () => {
    it('Should return 204 on add survey success', async () => {
      await request(app)
        .post('/api/survey')
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
