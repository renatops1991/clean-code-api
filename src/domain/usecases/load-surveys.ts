import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveys {
  load(accountId: string): Promise<LoadSurveys.Result>
}

export namespace LoadSurveys {
  export type Result = SurveyModel[]
}
