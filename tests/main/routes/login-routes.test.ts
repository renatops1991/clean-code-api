import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { setUpApp } from '@/main/config/app'
import { hash } from 'bcrypt'
import { Express } from 'express'
import { Collection } from 'mongodb'
import request from 'supertest'

let accountCollection: Collection
let app: Express

describe('LoginRoutes', () => {
  beforeAll(async () => {
    app = await setUpApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('SignUp', () => {
    it('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'john foo bar',
          email: 'john@bar.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('Login', () => {
    it('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'john foo bar',
        email: 'john@bar.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'john@bar.com',
          password: '123'
        })
        .expect(200)
    })
    it('Should return 401 on login fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'john@bar.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
