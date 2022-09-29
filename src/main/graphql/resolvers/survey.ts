import { apolloServerResolverAdapter } from '@/main/adapters'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories'

export default {
  Query: {
    surveys: async (parent: any, args: any, context: any) => await apolloServerResolverAdapter(makeLoadSurveysController(), args, context)
  },

  Mutation: {
    survey: async (parent: any, args: any, context: any) => await apolloServerResolverAdapter(makeAddSurveyController(), args, context)
  }
}
