import { InvalidParamError } from '@/presentation/errors'
import {
  forbidden,
  serverError,
  success
} from '@/presentation/helpers/http-helper'
import { SaveSurveyResultController } from '@/presentation/controllers/save-survey-result-controller'
import { LoadAnswersBySurvey, SaveSurveyResult } from '@/domain/usecases'
import { fixturesSurveyResultModel, throwError } from '@/tests/domain/fixtures'
import MockDate from 'mockdate'
import {
  mockLoadAnswersBySurvey,
  mockSaveSurveyResult
} from '@/tests/presentation/mocks'

const fixtureRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'foo',
  answer: 'bar',
  accountId: 'foo'
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  )
  return {
    sut,
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers')
    await sut.handle(fixtureRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
  it('Should return 403 if LoadAnswersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest
      .spyOn(loadAnswersBySurveyStub, 'loadAnswers')
      .mockReturnValueOnce(Promise.resolve([]))
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toStrictEqual(
      forbidden(new InvalidParamError('surveyId'))
    )
  })
  it('Should return 500 if LoadAnswersBySurvey throws exception', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest
      .spyOn(loadAnswersBySurveyStub, 'loadAnswers')
      .mockImplementationOnce(throwError)
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toStrictEqual(serverError(new Error()))
  })
  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    fixtureRequest().answer = 'foo'
    const expectedResponse = await sut.handle(
      Object.assign({}, fixtureRequest(), { answer: 'xis' })
    )
    expect(expectedResponse).toStrictEqual(
      forbidden(new InvalidParamError('answer'))
    )
  })
  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(fixtureRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'foo',
      surveyId: 'foo',
      answer: 'bar',
      createdAt: new Date()
    })
  })
  it('Should return 500 if SaveSurveyResult throws exception', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toStrictEqual(serverError(new Error()))
  })
  it('Should return 200 on a success', async () => {
    const { sut } = makeSut()
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toStrictEqual(success(fixturesSurveyResultModel()))
  })
})
