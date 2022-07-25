import { fixturesSurveyResultModel } from '@/tests/domain/fixtures'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(fixturesSurveyResultModel())
    }
  }
  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    surveyId: string
    accountId: string
    async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
      this.surveyId = surveyId
      this.accountId = accountId
      return await Promise.resolve(fixturesSurveyResultModel())
    }
  }
  return new LoadSurveyResultStub()
}
