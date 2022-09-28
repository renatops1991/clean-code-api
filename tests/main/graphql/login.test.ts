import { MongoHelper } from '@/infra/db/mongodb'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '@/main/config/app'

let accountCollection: Collection

describe('Login GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SignIn', () => {
    const query = `query {
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
        .send({ query })

      const expectedResponseBody = expectedResponse.body.data.signIn
      expect(expectedResponse.status).toBe(200)
      expect(expectedResponseBody.accessToken).toBeTruthy()
      expect(expectedResponseBody.name).toBe('john foo bar')
    })

    it('Should return an UnauthorizedError on invalid credentials', async () => {
      const expectedResponse = await request(app)
        .post('/graphql')
        .send({ query })

      expect(expectedResponse.status).toBe(401)
      expect(expectedResponse.body.data).toBeFalsy()
      expect(expectedResponse.body.errors[0].message).toBe('Unauthorized error')
    })
  })

  describe('SignUp', () => {
    const query = `
      mutation {
        signUp(name: "John foo bar", email: "john@bar.com", password: "123", passwordConfirmation: "123"){
          accessToken
          name
        }
      }
    `
    it('Should return an Account on valid data', async () => {
      const expectedResponse = await request(app)
        .post('/graphql')
        .send({ query })

      const expectedResponseBody = expectedResponse.body.data.signUp
      expect(expectedResponse.status).toBe(200)
      expect(expectedResponseBody.accessToken).toBeTruthy()
      expect(expectedResponseBody.name).toBe('John foo bar')
    })

    it('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'john foo bar',
        email: 'john@bar.com',
        password
      })

      const expectedResponse = await request(app)
        .post('/graphql')
        .send({ query })

      expect(expectedResponse.status).toBe(403)
      expect(expectedResponse.body.data).toBeFalsy()
      expect(expectedResponse.body.errors[0].message).toBe('The received email is already in use')
    })
  })
})
