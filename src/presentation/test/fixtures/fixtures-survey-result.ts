import { SurveyResultModel } from '@/domain/models/survey-result'

export const fixtureSaveSurveyResult = (): SurveyResultModel => ({
  id: 'bar',
  surveyId: 'bar',
  accountId: 'bar',
  createdAt: new Date(),
  answer: 'bar'
})
