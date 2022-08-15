import { DbCheckSurveyById } from '@/data/usecases/db-check-survey-by-id'
import { CheckSurveyByIdRepository } from '@/data/protocols'
import { throwError } from '@/tests/domain/fixtures'
import { mockCheckSurveyByIdRepository } from '../mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)
  return {
    sut,
    checkSurveyByIdRepositoryStub
  }
}

describe('DbCheckSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
    await sut.checkById('foo')
    expect(checkByIdSpy).toHaveBeenCalledWith('foo')
  })
  it('Should return true if CheckSurveyByIdRepository if returns true', async () => {
    const { sut } = makeSut()
    const expectedSurvey = await sut.checkById('foo')
    expect(expectedSurvey).toBeTruthy()
  })

  it('Should return false if CheckSurveyByIdRepository if returns false', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const expectedSurvey = await sut.checkById('foo')
    expect(expectedSurvey).toBeFalsy()
  })
  it('Should throw if CheckSurveyByIdRepository throws exception', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockImplementationOnce(throwError)
    const expectedPromise = sut.checkById('foo')
    await expect(expectedPromise).rejects.toThrow()
  })
})
