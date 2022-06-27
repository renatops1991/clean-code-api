import { throwError } from '@/domain/fixtures'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyById } from '@/presentation/test/mocks'
import { LoadSurveyResultController } from '../load-survey-result-controller'
import { HttpRequest, LoadSurveyById } from '../load-survey-result-protocols'

const fixturesRequest = (): HttpRequest => ({
  params: {
    surveyId: 'foo'
  }
})

type SutTypes = {
  loadSurveyByIdStub: LoadSurveyById
  sut: LoadSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResultController', () => {
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(fixturesRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
  it('Should  return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const expectedResponse = await sut.handle(fixturesRequest())
    expect(expectedResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  it('Should return 500 if LoadSurveyById throws error', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const expectedResponse = await sut.handle(fixturesRequest())
    expect(expectedResponse).toEqual(serverError(new Error()))
  })
})
