import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<LoadSurveyByIdRepository.Result>
}

export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel
}
