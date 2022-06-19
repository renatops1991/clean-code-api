import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const fixturesSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'foo',
  surveyId: 'foo',
  answer: 'bar',
  createdAt: new Date()
})

export const fixturesSurveyResultModel = (): SurveyResultModel => ({
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
