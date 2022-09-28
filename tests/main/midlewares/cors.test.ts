import { setUpApp } from '@/main/config/app'
import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('CORS Middlewares', () => {
  beforeAll(async () => {
    app = await setUpApp()
  })
  it('Should enable CORS', async () => {
    app.get('/cors-test', (request, response) => {
      response.send()
    })
    await request(app)
      .get('/cors-test')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
