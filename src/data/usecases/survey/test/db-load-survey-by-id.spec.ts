import { DbLoadSurveyById } from '../db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from '../db-survey-protocols'
import { throwError } from '@/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'foo',
    question: 'foo?',
    answers: [{
      answer: 'bar',
      image: 'images/foo.png'
    }],
    createdAt: new Date()
  }
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
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
    expect(expectedSurvey).toEqual(makeFakeSurvey())
  })
  it('Should throw if LoadSurveyByIdRepository throws exception', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const expectedPromise = sut.loadById('foo')
    await expect(expectedPromise).rejects.toThrow()
  })
})
