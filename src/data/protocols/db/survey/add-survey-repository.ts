import { AddSurvey } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add(surveyData: AddSurvey.Params): Promise<void>
}

export namespace AddSurveyRepository {
  export type Params = AddSurvey.Params
}
