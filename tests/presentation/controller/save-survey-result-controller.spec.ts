import { InvalidParamError } from '@/presentation/errors'
import {
  forbidden,
  serverError,
  success
} from '@/presentation/helpers/http-helper'
import { SaveSurveyResultController } from '@/presentation/controllers/save-survey-result-controller'
import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { fixturesSurveyResultModel, throwError } from '@/tests/domain/fixtures'
import MockDate from 'mockdate'
import {
  mockLoadSurveyById,
  mockSaveSurveyResult
} from '@/tests/presentation/mocks'

const fixtureRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'foo',
  answer: 'bar',
  accountId: 'foo'
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  )
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
    await sut.handle(fixtureRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
  it('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toStrictEqual(
      forbidden(new InvalidParamError('surveyId'))
    )
  })
  it('Should return 500 if LoadSurveyById throws exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(throwError)
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toStrictEqual(serverError(new Error()))
  })
  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    fixtureRequest().answer = 'foo'
    const expectedResponse = await sut.handle(
      Object.assign({}, fixtureRequest(), { answer: 'foo' })
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
