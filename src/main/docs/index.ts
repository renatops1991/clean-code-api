import { loginPath } from './paths/login-path'
import { accountSchema, errorSchema, loginParamsSchema } from './schemas'
import {
  badRequest,
  unauthorized,
  serverError,
  notFound
} from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean code Node Api',
    description: 'Api for creating surveys between programmers'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Login'
    }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound
  }
}
