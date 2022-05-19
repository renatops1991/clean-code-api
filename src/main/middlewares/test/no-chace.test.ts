import app from '@/main/config/app'
import request from 'supertest'
import { noCache } from '../no-cache'

describe('NoCache', () => {
  it('Should disable cache', async () => {
    app.get('/no-cache-test', noCache, (request, response) => {
      response.send()
    })
    await request(app)
      .get('/no-cache-test')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
