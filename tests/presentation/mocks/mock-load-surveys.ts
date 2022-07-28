import { fixturesSurveyModel, fixturesSurveysModel } from '@/tests/domain/fixtures'
import { LoadSurveyById, LoadSurveys } from '@/domain/usecases'
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

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(fixturesSurveyModel())
    }
  }
  return new LoadSurveyByIdStub()
}
