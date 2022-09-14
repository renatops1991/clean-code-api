import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { GraphQLError } from 'graphql'

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

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [{
      requestDidStart: async () => ({
        willSendResponse: async ({ response, errors }) => handlerErrors(response, errors)
      })
    }]
  })
  await server.start()
  server.applyMiddleware({ app })
}
