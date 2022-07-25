import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  createdAt: Date
}
export interface SaveSurveyResult {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>
}
