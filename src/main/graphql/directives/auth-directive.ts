import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { ForbiddenError } from 'apollo-server-express'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'

export const authDirectiveTransform = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')

      if (authDirective) {
        const { resolve } = fieldConfig
        fieldConfig.resolve = async (parent, args, context, info: GraphQLResolveInfo) => {
          const httpRequest = {
            accessToken: context?.req?.headers?.['x-access-token']
          }

          const httpResponse = await makeAuthMiddleware().handle(httpRequest)

          if (httpResponse.statusCode !== 200) {
            throw new ForbiddenError(httpResponse.body.message)
          }

          Object.assign(context?.req, httpResponse.body)
          return resolve.call(this, parent, args, context, info)
        }
      }
      return fieldConfig
    }
  })
}
