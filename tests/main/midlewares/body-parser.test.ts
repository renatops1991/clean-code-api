import { setUpApp } from '@/main/config/app'
import { Express } from 'express'
import request from 'supertest'

let app: Express
describe('Body Parser Middleware', () => {
  beforeAll(async () => {
    app = await setUpApp()
  })
  it('Should parse body as json', async () => {
    app.post('/body-parser-test', (request, response) => {
      response.send(request.body)
    })

    await request(app)
      .post('/body-parser-test')
      .send({ name: 'Renato Pereira' })
      .expect({ name: 'Renato Pereira' })
  })
})
