import { fixturesSurveyResultModel, throwError } from '@/domain/fixtures'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper'
import {
  mockLoadSurveyById,
  mockLoadSurveyResult
} from '@/presentation/test/mocks'
import { LoadSurveyResultController } from '../load-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyById,
  LoadSurveyResult
} from '../load-survey-result-protocols'
import MockDate from 'mockdate'

const fixturesRequest = (): HttpRequest => ({
  params: {
    surveyId: 'foo'
  }
})

type SutTypes = {
  loadSurveyByIdStub: LoadSurveyById
  sut: LoadSurveyResultController
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub
  )
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(fixturesRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
  it('Should  return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))
    const expectedResponse = await sut.handle(fixturesRequest())
    expect(expectedResponse).toEqual(
      forbidden(new InvalidParamError('surveyId'))
    )
  })
  it('Should return 500 if LoadSurveyById throws error', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(throwError)
    const expectedResponse = await sut.handle(fixturesRequest())
    expect(expectedResponse).toEqual(serverError(new Error()))
  })
  it('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(fixturesRequest())
    expect(loadSpy).toHaveBeenCalledWith('foo')
  })
  it('Should return 500 if LoadSurveyResult throws error', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest
      .spyOn(loadSurveyResultStub, 'load')
      .mockImplementationOnce(throwError)
    const expectedResponse = await sut.handle(fixturesRequest())
    expect(expectedResponse).toEqual(serverError(new Error()))
  })
  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const expectedSurveyResult = await sut.handle(fixturesRequest())
    expect(expectedSurveyResult).toEqual(success(fixturesSurveyResultModel()))
  })
})
