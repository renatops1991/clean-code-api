import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { authDirectiveTransform } from '@/main/graphql/directives'
import { ApolloServer } from 'apollo-server-express'

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransform(schema)
export const makeApolloServer = (): ApolloServer => new ApolloServer({
  schema
})
