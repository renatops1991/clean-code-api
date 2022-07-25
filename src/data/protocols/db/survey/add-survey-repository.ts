import { AddSurveyParams } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add(surveyData: AddSurveyParams): Promise<void>
}
