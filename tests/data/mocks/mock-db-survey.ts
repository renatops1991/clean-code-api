import { AddSurvey } from '@/domain/usecases/add-survey'
import {
  AddSurveyRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@/data/protocols'
import { fixturesSurveyModel, fixturesSurveysModel } from '@/tests/domain/fixtures'
import { SurveyModel } from '@/domain/models/survey'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurvey.Params): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
      return await Promise.resolve(fixturesSurveyModel())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadAnswersBySurveyRepository = (): LoadAnswersBySurveyRepository => {
  class LoadAnswersBySurveyRepositoryStub implements LoadAnswersBySurveyRepository {
    async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
      return await Promise.resolve([fixturesSurveyModel().answers[0].answer])
    }
  }

  return new LoadAnswersBySurveyRepositoryStub()
}

export const mockCheckSurveyByIdRepository = (): CheckSurveyByIdRepository => {
  class CheckSurveyByIdRepositoryStub implements CheckSurveyByIdRepository {
    async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
      return true
    }
  }

  return new CheckSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (accountId: string): Promise<SurveyModel[]> {
      return await Promise.resolve(fixturesSurveysModel())
    }
  }
  return new LoadSurveysRepositoryStub()
}
