import { MongoHelper } from '@/infra/db/mongodb'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

let accountCollection: Collection
let surveyCollection: Collection

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

describe('Survey GraphQL', () => {
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
    const query = `query{
        surveys {
            id
            question
            answers {
                image
                answer
            }
            createdAt
            didAnswer
        }
    }`
    it('Should returns surveys list', async () => {
      const accessToken = await makeAccessToken()
      const currentDay = new Date()
      await surveyCollection.insertOne({
        question: 'foo?',
        answers: [{
          answer: 'bar',
          image: 'images/foo.jpg'
        }, {
          answer: 'bar?'
        }],
        createdAt: currentDay
      })

      const expectedResponse = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      const expectedResponseBody = expectedResponse.body.data.surveys[0]
      expect(expectedResponse.status).toBe(200)
      expect(expectedResponse.body.data.surveys.length).toBe(1)
      expect(expectedResponseBody.id).toBeTruthy()
      expect(expectedResponseBody.question).toBe('foo?')
      expect(expectedResponseBody.createdAt).toBe(currentDay.toISOString())
      expect(expectedResponseBody.didAnswer).toBeFalsy()
      expect(expectedResponseBody.answers).toEqual([{
        answer: 'bar',
        image: 'images/foo.jpg'
      }, {
        answer: 'bar?',
        image: null
      }])
    })
  })
})
