import request from 'supertest'
import app from '../config/app'

describe('CORS Middlewares', () => {
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
