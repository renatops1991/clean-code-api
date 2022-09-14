import { makeSignInController, makeSignupController } from '@/main/factories'
import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver-adapter'

export default {
  Query: {
    signIn: async (parent: any, args: any) => await apolloServerResolverAdapter(makeSignInController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => await apolloServerResolverAdapter(makeSignupController(), args)
  }
}
