import {
  LoadSurveyResultRepository,
  LoadSurveyResult,
  SurveyResultModel,
  LoadSurveyByIdRepository
} from './db-survey-result-protocols'
export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId
    )
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      return {
        surveyId: survey.id,
        question: survey.question,
        createdAt: survey.createdAt,
        answers: survey.answers.map((answer) =>
          Object.assign({}, answer, {
            count: 0,
            percent: 0,
            isCurrentAccountAnswer: false
          })
        )
      }
    }
    return surveyResult
  }
}
