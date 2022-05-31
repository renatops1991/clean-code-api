export const signupParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'John Foo Bar'
    },
    email: {
      type: 'string',
      example: 'john@bar.com'
    },
    password: {
      type: 'string',
      example: '12345'
    },
    passwordConfirmation: {
      type: 'string',
      example: '12345'
    }
  },
  required: ['name', 'email', 'password', 'passwordConfirmation']
}
