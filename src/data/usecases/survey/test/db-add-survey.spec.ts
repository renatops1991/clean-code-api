import { DbAddSurvey } from '../db-add-survey'
import { AddSurveyRepository } from '../db-survey-protocols'
import { throwError, fixturesSurveyParams } from '@/domain/fixtures'
import { mockAddSurveyRepository } from '@/data/mocks'
import MockDate from 'mockdate'

interface SutTypes{
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}
describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = fixturesSurveyParams()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
  it('Should throw the exception of Add SurveyRepository throws error', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add')
      .mockImplementationOnce(throwError)
    const expectedResponse = sut.add(fixturesSurveyParams())
    await expect(expectedResponse).rejects.toThrow()
  })
})
