import { DbLoadSurveyResult } from '../db-load-survey-result'
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository
} from '../db-survey-result-protocols'
import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyResultRepository
} from '@/../tests/data/mocks'
import { fixturesSurveyResultModel, throwError } from '@/domain/fixtures'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}
let surveyId: string
let accountId: string

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  )

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.datatype.uuid()
    accountId = faker.datatype.uuid()
  })
  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )
    await sut.load(surveyId, accountId)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyId, accountId)
  })

  it('Should throw exception if LoadSurveyResultRepository throw exception', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const expectedError = sut.load(surveyId, accountId)
    await expect(expectedError).rejects.toThrow()
  })
  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub
    } = makeSut()
    const loadBySpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null))
    await sut.load(surveyId, accountId)
    expect(loadBySpy).toHaveBeenCalledWith(surveyId)
  })
  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null))
    const expectedSurveyResult = await sut.load(surveyId, accountId)
    expect(expectedSurveyResult).toEqual(fixturesSurveyResultModel())
  })
  it('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const expectedSurveyResult = await sut.load(surveyId, accountId)
    expect(expectedSurveyResult).toEqual(fixturesSurveyResultModel())
  })
})
