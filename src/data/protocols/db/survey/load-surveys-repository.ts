import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveysRepository {
  loadAll(accountId: string): Promise<LoadSurveysRepository.Result>
}

export namespace LoadSurveysRepository {
  export type Result = SurveyModel[]
}
