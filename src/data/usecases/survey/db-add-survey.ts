import { AddSurveyRepository } from './db-survey-protocols'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
