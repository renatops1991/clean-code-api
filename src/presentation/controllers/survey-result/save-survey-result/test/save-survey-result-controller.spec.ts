import { SaveSurveyResultController } from '../save-survey-result-controller'
import { SurveyModel, HttpRequest, LoadSurveyById } from '../save-survey-result-protocols'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'foo'
  }
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'foo',
  question: 'foo',
  answers: [{
    image: 'image/foo.jpg',
    answer: 'bar'
  }],
  createdAt: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes ={
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}
describe('SaveSurveyResult Controller', () => {
  it('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
})
