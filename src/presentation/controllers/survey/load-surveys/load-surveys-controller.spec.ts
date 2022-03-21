import { LoadSurveysController } from './load-surveys-contoller'
import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { success } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'
interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'foo',
    question: 'foo?',
    answers: [{
      answer: 'bar',
      image: 'images/foo.png'
    }],
    date: new Date()
  },
  {
    id: 'bar',
    question: 'bar?',
    answers: [{
      answer: 'foo',
      image: 'images/bar.png'
    }],
    date: new Date()
  }]
}

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut, loadSurveysStub
  }
}
describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const expectedSurveys = await sut.handle({})
    expect(expectedSurveys).toEqual(success(makeFakeSurveys()))
  })
})
