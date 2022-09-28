import { apolloServerResolverAdapter } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories'

export default {
  Query: {
    surveys: async (parent: any, args: any, context: any) => await apolloServerResolverAdapter(makeLoadSurveysController(), args, context)
  }
}
