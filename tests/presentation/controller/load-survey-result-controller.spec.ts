import { fixturesSurveyResultModel, throwError } from '@/tests/domain/fixtures'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import {
  LoadSurveyById,
  LoadSurveyResult
} from '@/domain/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers/load-survey-result-controller'
import {
  mockLoadSurveyById,
  mockLoadSurveyResult
} from '@/tests/presentation/mocks'
import {
  HttpRequest
} from '@/presentation/protocols/http'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const fixturesRequest = (): HttpRequest => ({
  accountId: faker.datatype.uuid(),
  params: {
    surveyId: faker.datatype.uuid()
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
    const fakeHttpRequest = fixturesRequest()
    await sut.handle(fakeHttpRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith(fakeHttpRequest.params.surveyId)
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
    const fakeHttpRequest = fixturesRequest()
    await sut.handle(fakeHttpRequest)
    expect(loadSpy).toHaveBeenCalledWith(fakeHttpRequest.params.surveyId, fakeHttpRequest.accountId)
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
