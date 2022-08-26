import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { LoadSurveys } from '@/domain/usecases/load-surveys'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly LoadSurveysRepository: LoadSurveysRepository) { }

  async load (accountId: string): Promise<LoadSurveysRepository.Result> {
    const listSurveys = await this.LoadSurveysRepository.loadAll(accountId)
    return listSurveys
  }
}
