import { AddSurveyParams, AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/usecases/survey/db-survey-protocols'
import { fixturesSurveyModel, fixturesSurveysModel } from '@/domain/fixtures'
import { SurveyModel } from '@/domain/models/survey'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(fixturesSurveyModel()))
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(fixturesSurveysModel()))
    }
  }
  return new LoadSurveysRepositoryStub()
}
