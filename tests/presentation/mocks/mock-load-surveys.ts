import { fixturesSurveysModel } from '@/tests/domain/fixtures'
import {
  LoadAnswersBySurvey,
  LoadSurveys,
  CheckSurveyById
} from '@/domain/usecases'
import { SurveyModel } from '@/domain/models/survey'

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    accountId: string
    async load (accountId: string): Promise<SurveyModel[]> {
      this.accountId = accountId
      return await Promise.resolve(fixturesSurveysModel())
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  class LoadAnswersBySurveyStub implements LoadAnswersBySurvey {
    id: string
    async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
      this.id = id
      return await Promise.resolve(['bar', 'foo'])
    }
  }
  return new LoadAnswersBySurveyStub()
}

export const mockCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById (id: string): Promise<CheckSurveyById.Result> {
      return true
    }
  }
  return new CheckSurveyByIdStub()
}
