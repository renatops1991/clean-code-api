import { apolloServerResolverAdapter } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories'

export default {
  Query: {
    surveys: async () => await apolloServerResolverAdapter(makeLoadSurveysController())
  }
}
