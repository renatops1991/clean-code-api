import { LoadAnswersBySurvey } from '@/domain/usecases/load-answers-by-survey'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository'

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (
    private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository
  ) {}

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    return await this.loadAnswersBySurveyRepository.loadAnswers(id) ?? []
  }
}
