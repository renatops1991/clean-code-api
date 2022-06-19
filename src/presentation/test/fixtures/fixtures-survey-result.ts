import { SurveyResultModel } from '@/domain/models/survey-result'

export const fixtureSaveSurveyResult = (): SurveyResultModel => ({
  surveyId: 'bar',
  question: 'bar',
  createdAt: new Date(),
  answers: [{
    image: 'image/foo.jpg',
    answer: 'bar',
    count: 1,
    percent: 50
  }]
})
