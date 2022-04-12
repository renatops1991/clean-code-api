import { DbSaveSurveyResult } from '@/data/usecases/survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@/domain/usecases/save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
