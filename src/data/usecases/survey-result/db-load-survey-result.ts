import { LoadSurveyResultRepository, LoadSurveyResult, SurveyResultModel } from './db-survey-result-protocols'
export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return await Promise.resolve(null)
  }
}
