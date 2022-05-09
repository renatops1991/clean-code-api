import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const fixturesSurveyModel = (): SurveyModel => {
  return {
    id: 'foo',
    question: 'foo?',
    answers: [{
      answer: 'bar',
      image: 'images/foo.png'
    }],
    createdAt: new Date()
  }
}

export const fixturesSurveyParams = (): AddSurveyParams => ({
  question: 'foo?',
  answers: [{
    answer: 'bar',
    image: 'images/foo.jpg'
  }],
  createdAt: new Date()
})

export const fixturesSurveysModel = (): SurveyModel[] => {
  return [{
    id: 'foo',
    question: 'foo?',
    answers: [{
      answer: 'bar',
      image: 'images/foo.png'
    }],
    createdAt: new Date()
  },
  {
    id: 'bar',
    question: 'bar?',
    answers: [{
      answer: 'foo',
      image: 'images/bar.png'
    }],
    createdAt: new Date()
  }]
}
