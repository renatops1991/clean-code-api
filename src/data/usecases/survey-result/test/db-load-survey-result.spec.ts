import { DbLoadSurveyResult } from '../db-load-survey-result'
import { LoadSurveyResultRepository } from '../db-survey-result-protocols'
import { mockLoadSurveyResultRepository } from '@/data/mocks'
import { throwError } from '@/domain/fixtures'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  it('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('foo')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('foo')
  })

  it('Should throw exception if LoadSurveyResultRepository throw exception', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const expectedError = sut.load('foo')
    await expect(expectedError).rejects.toThrow()
  })
})