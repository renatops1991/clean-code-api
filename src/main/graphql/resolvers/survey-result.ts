import { apolloServerResolverAdapter } from '@/main/adapters'
import {
  makeLoadSurveyResultController,
  makeSaveSurveyResultController
} from '@/main/factories'

export default {
  Query: {
    surveyResult: async (parent: any, args: any) => await apolloServerResolverAdapter(makeLoadSurveyResultController(), args)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any) => await apolloServerResolverAdapter(makeSaveSurveyResultController(), args)
  }
}
