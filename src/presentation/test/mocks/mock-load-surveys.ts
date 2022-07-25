import { fixturesSurveyModel, fixturesSurveysModel } from '@/tests/domain/fixtures'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys, SurveyModel } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols'

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
