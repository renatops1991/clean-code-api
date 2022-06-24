import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const fixturesSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'foo',
  surveyId: 'foo',
  answer: 'bar',
  createdAt: new Date()
})

export const fixturesSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'foo',
  question: 'foo?',
  createdAt: new Date(),
  answers: [{
    image: 'images/foo.png',
    answer: 'bar',
    count: 0,
    percent: 0
  }]
})
