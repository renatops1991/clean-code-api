import { LoadSurveysRepository, SurveyModel, LoadSurveys } from './db-survey-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly LoadSurveysRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[]> {
    const listSurveys = await this.LoadSurveysRepository.loadAll()
    return listSurveys
  }
}
