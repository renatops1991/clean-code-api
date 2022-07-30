import { SurveyModel } from '@/domain/models/survey'
import { AddSurvey } from '@/domain/usecases/add-survey'
import { faker } from '@faker-js/faker'

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

export const fixturesSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.word(),
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
