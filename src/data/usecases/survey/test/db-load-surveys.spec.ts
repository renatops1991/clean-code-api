import { DbLoadSurveys } from '../db-load-surveys'
import { LoadSurveysRepository } from '../db-survey-protocols'
import { throwError, fixturesSurveysModel } from '@/domain/fixtures'
import { mockLoadSurveysRepository } from '@/data/mocks'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    const accountId = faker.datatype.uuid()
    await sut.load(accountId)
    expect(loadAllSpy).toHaveBeenCalledWith(accountId)
  })
  it('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const expectedListSurveys = await sut.load(faker.datatype.uuid())
    expect(expectedListSurveys).toEqual(fixturesSurveysModel())
  })
  it('Should throws if LoadSurveysRepository throws exception', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const expectedResponse = sut.load(faker.datatype.uuid())
    await expect(expectedResponse).rejects.toThrow()
  })
})
