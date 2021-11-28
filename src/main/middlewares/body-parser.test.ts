import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
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
