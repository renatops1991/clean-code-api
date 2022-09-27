import { MongoHelper } from '@/infra/db/mongodb'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '@/main/config/app'
import { send } from 'process'

let accountCollection: Collection

describe('Login GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SignIn', () => {
    const signInQuery = `query {
        signIn(email: "john@bar.com", password: "123"){
          accessToken
          name
        }
      }`
    it('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'john foo bar',
        email: 'john@bar.com',
        password
      })

      const expectedResponse = await request(app)
        .post('/graphql')
        .send({ query: signInQuery })

      const expectedResponseBody = expectedResponse.body.data.signIn
      expect(expectedResponse.status).toBe(200)
      expect(expectedResponseBody.accessToken).toBeTruthy()
      expect(expectedResponseBody.name).toBe('john foo bar')
    })

    it('Should return an UnauthorizedError on invalid credentials', async () => {
      const expectedResponse = await request(app)
        .post('/graphql')
      send({ query: signInQuery })

      expect(expectedResponse.status).toBe(401)
      expect(expectedResponse.body.data).toBeFalsy()
      expect(expectedResponse.body.errors[0].message).toBe('UnauthorizedError')
    })
  })
})
