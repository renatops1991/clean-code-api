export const loginParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      example: 'john@bar.com'
    },
    password: {
      type: 'string',
      example: '12345'
    }
  },
  required: ['email', 'password']
}
