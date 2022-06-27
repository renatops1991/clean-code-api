import { mockLoadSurveyById } from '@/presentation/test/mocks'
import { LoadSurveyResultController } from '../load-survey-result-controller'
import { HttpRequest, LoadSurveyById } from '../load-survey-result-protocols'

const fixturesRequest = (): HttpRequest => ({
  params: {
    surveyId: 'foo'
  }
})

type SutTypes = {
  loadSurveyByIdStub: LoadSurveyById
  sut: LoadSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResultController', () => {
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(fixturesRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
})
