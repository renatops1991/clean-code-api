import { DbAddSurvey } from '../../../../data/usecases/survey/db-add-survey'
import { DbLoadSurveys } from '../../../../data/usecases/survey/db-load-surveys'
import { AddSurvey } from '../../../../domain/usecases/add-survey'
import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
