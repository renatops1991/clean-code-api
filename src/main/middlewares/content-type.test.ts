
import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  it('Should return default content type as json', async () => {
    app.get('/content-type-test', (request, response) => {
      response.send('')
    })
    await request(app)
      .get('/content-type-test')
      .expect('content-type', /json/)
  })
  it('Should return xml content type when forced', async () => {
    app.get('/content-type-test-xml', (request, response) => {
      response.type('xml')
      response.send('')
    })
    await request(app)
      .get('/content-type-test-xml')
      .expect('content-type', /xml/)
  })
})
