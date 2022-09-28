import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import { authDirectiveTransform } from '@/main/graphql/directives'

import { ApolloServer } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

const handlerErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    if (hasErrorAreTheSame(error, 'UserInputError')) {
      response.http.status = 400
    } else if (hasErrorAreTheSame(error, 'AuthenticationError')) {
      response.http.status = 401
    } else if (hasErrorAreTheSame(error, 'ForbiddenError')) {
      response.http.status = 403
    } else {
      response.http.status = 500
    }
  })
}

const hasErrorAreTheSame = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransform(schema)

export const setUpApolloServer = (): ApolloServer => new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  plugins: [{
    requestDidStart: async () => ({
      willSendResponse: async ({ response, errors }) => handlerErrors(response, errors)
    })
  }]
})
