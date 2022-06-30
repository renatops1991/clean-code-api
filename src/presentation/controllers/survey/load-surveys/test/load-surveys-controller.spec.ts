import { LoadSurveysController } from '../load-surveys-contoller'
import { LoadSurveys, SurveyModel } from '../load-surveys-controller-protocols'
import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/fixtures'
import MockDate from 'mockdate'
import { mockLoadSurveys } from '@/presentation/test/mocks'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const fixturesSurveysModel = (): SurveyModel[] => {
  return [{
    id: 'foo',
    question: 'foo?',
    answers: [{
      answer: 'bar',
      image: 'images/foo.png'
    }],
    createdAt: new Date()
  },
  {
    id: 'bar',
    question: 'bar?',
    answers: [{
      answer: 'foo',
      image: 'images/bar.png'
    }],
    createdAt: new Date()
  }]
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
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
    expect(expectedSurveys).toEqual(success(fixturesSurveysModel()))
  })
  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const expectedResponse = await sut.handle({})
    expect(expectedResponse).toEqual(noContent())
  })
  it('Should return 500 if LoadSurveys throws exception', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const expectedErrorResponse = await sut.handle({})
    expect(expectedErrorResponse).toStrictEqual(serverError(new Error()))
  })
})
