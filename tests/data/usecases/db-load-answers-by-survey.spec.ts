import { DbLoadAnswersBySurvey } from '@/data/usecases/db-load-answers-by-survey'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository'
import { throwError, fixturesSurveyModel } from '@/tests/domain/fixtures'
import { mockLoadAnswersBySurveyRepository } from '../mocks'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)
  return {
    sut,
    loadAnswersBySurveyRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadAnswersBySurveyRepository', async () => {
    const surveyId = faker.database.mongodbObjectId()
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
    await sut.loadAnswers(surveyId)
    expect(loadAnswersSpy).toHaveBeenCalledWith(surveyId)
  })
  it('Should return empty array if LoadAnswersBySurveyRepository returns null', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest
      .spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
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
  it('Should throw if LoadAnswersBySurveyRepository throws exception', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest
      .spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
      .mockImplementationOnce(throwError)
    const expectedPromise = sut.loadAnswers('foo')
    await expect(expectedPromise).rejects.toThrow()
  })
})
