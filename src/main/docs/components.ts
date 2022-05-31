
import { apiKeyAuthSchema } from './schemas/'
import {
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden
} from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden
}
