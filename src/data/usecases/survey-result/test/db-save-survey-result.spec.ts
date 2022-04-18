import { DbSaveSurveyResult } from '../db-save-survey-result'
import { SaveSurveyResultRepository } from '../db-survey-result-protocols'
import { throwError, fixturesSurveyResultParams, fixturesSurveyResultModel } from '@/domain/mocks'
import { mockSaveSurveyResultRepository } from '@/data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
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
  it('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(fixturesSurveyResultParams())
    expect(surveyResult).toEqual(fixturesSurveyResultModel())
  })
})
