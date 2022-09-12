import { makeSignInController } from '@/main/factories'
import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver-adapter'

export default {
  Query: {
    login: async (parent: any, args: any) => await apolloServerResolverAdapter(makeSignInController(), args)
  }
}
