import { fixturesSurveyResultModel, throwError } from '@/tests/domain/fixtures'
import { InvalidParamError } from '@/presentation/errors'
import {
  forbidden,
  serverError,
  success
} from '@/presentation/helpers/http-helper'
import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers/load-survey-result-controller'
import {
  mockCheckSurveyById,
  mockLoadSurveyResult
} from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const fixtureRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid()
})

type SutTypes = {
  checkSurveyByIdStub: CheckSurveyById
  sut: LoadSurveyResultController
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = mockCheckSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(
    checkSurveyByIdStub,
    loadSurveyResultStub
  )
  return {
    sut,
    checkSurveyByIdStub,
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
  it('Should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')
    const fakeHttpRequest = fixtureRequest()
    await sut.handle(fakeHttpRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith(fakeHttpRequest.surveyId)
  })
  it('Should  return 403 if CheckSurveyById returns null', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest
      .spyOn(checkSurveyByIdStub, 'checkById')
      .mockReturnValueOnce(Promise.resolve(false))
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toEqual(
      forbidden(new InvalidParamError('surveyId'))
    )
  })
  it('Should return 500 if CheckSurveyById throws error', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest
      .spyOn(checkSurveyByIdStub, 'checkById')
      .mockImplementationOnce(throwError)
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toEqual(serverError(new Error()))
  })
  it('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const fakeHttpRequest = fixtureRequest()
    await sut.handle(fakeHttpRequest)
    expect(loadSpy).toHaveBeenCalledWith(
      fakeHttpRequest.surveyId,
      fakeHttpRequest.accountId
    )
  })
  it('Should return 500 if LoadSurveyResult throws error', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toEqual(serverError(new Error()))
  })
  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const expectedSurveyResult = await sut.handle(fixtureRequest())
    expect(expectedSurveyResult).toEqual(success(fixturesSurveyResultModel()))
  })
})
