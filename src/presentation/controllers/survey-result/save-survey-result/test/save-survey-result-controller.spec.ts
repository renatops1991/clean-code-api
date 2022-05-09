import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from '../save-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult
} from '../save-survey-result-protocols'
import { throwError } from '@/domain/fixtures'
import MockDate from 'mockdate'
import { mockLoadSurveyById, mockSurveyResult } from '@/presentation/test/mocks'
import { fixtureSaveSurveyResult } from '@/presentation/test/fixtures'

const fixturesRequest = (): HttpRequest => ({
  params: {
    surveyId: 'foo'
  },
  body: {
    answer: 'bar'
  },
  accountId: 'foo'
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
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
  it('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(fixturesRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
  it('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  it('Should return 500 if LoadSurveyById throws exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'foo'
      },
      body: {
        answer: 'foo'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(fixturesRequest())
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
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('Should return 200 on a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fixturesRequest())
    expect(httpResponse).toEqual(success(fixtureSaveSurveyResult()))
  })
})
