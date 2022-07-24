import { DbSaveSurveyResult } from '../db-save-survey-result'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '../db-survey-result-protocols'
import { throwError, fixturesSurveyResultParams, fixturesSurveyResultModel } from '@/domain/fixtures'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/../tests/data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}
describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = fixturesSurveyResultParams()
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })
  it('Should throws if LoadSurveysRepository throws exception', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
    const expectedResponse = sut.save(fixturesSurveyResultParams())
    await expect(expectedResponse).rejects.toThrow()
  })
  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const surveyResultData = fixturesSurveyResultParams()
    await sut.save(surveyResultData)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId, surveyResultData.accountId)
  })
  it('Should throws if LoadSurveysRepository throws exception', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const expectedResponse = sut.save(fixturesSurveyResultParams())
    await expect(expectedResponse).rejects.toThrow()
  })
  it('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(fixturesSurveyResultParams())
    expect(surveyResult).toEqual(fixturesSurveyResultModel())
  })
})
