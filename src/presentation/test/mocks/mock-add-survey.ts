import { AddSurvey, AddSurveyParams } from '@/domain/usecases/add-survey'

export const mockSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyStub()
}
