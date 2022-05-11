import { AddSurvey, AddSurveyParams } from '@/presentation/controllers/survey/add-survey/add-survey-controller-protocols'

export const mockSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyStub()
}
