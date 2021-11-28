import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  it('Should return an account on success', async () => {
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
