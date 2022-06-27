import { mockLoadSurveyById } from '@/presentation/test/mocks'
import { LoadSurveyResultController } from '../load-survey-result-controller'
import { HttpRequest } from '../load-survey-result-protocols'

const fixturesRequest = (): HttpRequest => ({
  params: {
    surveyId: 'foo'
  }
})

describe('LoadSurveyResultController', () => {
  it('Should call LoadSurveyById with correct value', async () => {
    const loadSurveyByIdStub = mockLoadSurveyById()
    const sut = new LoadSurveyResultController(loadSurveyByIdStub)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(fixturesRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
})
