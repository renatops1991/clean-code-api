import { DbLoadAnswersBySurvey } from '@/data/usecases/db-load-answers-by-survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { throwError, fixturesSurveyModel } from '@/tests/domain/fixtures'
import { mockLoadSurveyByIdRepository } from '../mocks'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)
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
    const surveyId = faker.database.mongodbObjectId()
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadAnswers(surveyId)
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId)
  })
  it('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))
    const expectedSurvey = await sut.loadAnswers('foo')
    expect(expectedSurvey).toEqual([])
  })
  it('Should return answers on success', async () => {
    const { sut } = makeSut()
    const expectedSurvey = await sut.loadAnswers('foo')
    expect(expectedSurvey).toEqual([
      fixturesSurveyModel().answers[0].answer
    ])
  })
  it('Should throw if LoadSurveyByIdRepository throws exception', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(throwError)
    const expectedPromise = sut.loadAnswers('foo')
    await expect(expectedPromise).rejects.toThrow()
  })
})
