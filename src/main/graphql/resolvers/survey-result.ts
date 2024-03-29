import { apolloServerResolverAdapter } from '@/main/adapters'
import {
  makeLoadSurveyResultController,
  makeSaveSurveyResultController
} from '@/main/factories'

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any) => await apolloServerResolverAdapter(makeLoadSurveyResultController(), args, context)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any) => await apolloServerResolverAdapter(makeSaveSurveyResultController(), args, context)
  }
}
