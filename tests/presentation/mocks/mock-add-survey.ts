import { AddSurvey } from '@/domain/usecases/add-survey'

export const mockSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurvey.Params): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyStub()
}
