import { DbLoadSurveyById } from '@/data/usecases/db-load-survey-by-id'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { throwError, fixturesSurveyModel } from '@/domain/fixtures'
import { mockLoadSurveyByIdRepository } from '../mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('foo')
    expect(loadByIdSpy).toHaveBeenCalledWith('foo')
  })
  it('Should return Survey on success', async () => {
    const { sut } = makeSut()
    const expectedSurvey = await sut.loadById('foo')
    expect(expectedSurvey).toEqual(fixturesSurveyModel())
  })
  it('Should throw if LoadSurveyByIdRepository throws exception', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const expectedPromise = sut.loadById('foo')
    await expect(expectedPromise).rejects.toThrow()
  })
})
