import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/survey-result/db-survey-result-protocols'
import { fixturesSurveyResultModel } from '@/domain/fixtures/fixtures-survey-result'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve(fixturesSurveyResultModel()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
