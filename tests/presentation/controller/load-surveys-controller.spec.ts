import { LoadSurveysController } from '@/presentation/controllers/load-surveys-controller'
import { HttpRequest } from '@/presentation/protocols/http'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import {
  noContent,
  serverError,
  success
} from '@/presentation/helpers/http/http-helper'
import { fixturesSurveysModel, throwError } from '@/tests/domain/fixtures'
import { mockLoadSurveys } from '@/presentation/test/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  accountId: faker.datatype.uuid()
})

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}
describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys with correct values', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const loadSurveysSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle(httpRequest)
    expect(loadSurveysSpy).toHaveBeenCalledWith(httpRequest.accountId)
  })
  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const expectedSurveys = await sut.handle(makeFakeRequest())
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
    const expectedErrorResponse = await sut.handle(makeFakeRequest())
    expect(expectedErrorResponse).toStrictEqual(serverError(new Error()))
  })
})
