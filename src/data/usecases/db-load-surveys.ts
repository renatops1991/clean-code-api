import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly LoadSurveysRepository: LoadSurveysRepository) { }
  async load (accountId: string): Promise<SurveyModel[]> {
    const listSurveys = await this.LoadSurveysRepository.loadAll(accountId)
    return listSurveys
  }
}
