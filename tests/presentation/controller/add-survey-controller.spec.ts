import { Validation } from '@/presentation/protocols'
import { AddSurvey } from '@/domain/usecases/add-survey'
import { AddSurveyController } from '@/presentation/controllers/add-survey-controller'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-helper'
import { throwError } from '@/tests/domain/fixtures'
import { mockSurvey, mockValidation } from '@/tests/presentation/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const fixtureRequest = (): AddSurveyController.Request => ({
  question: 'foo?',
  answers: [
    {
      answer: 'bar',
      image: 'images/foo.png'
    }
  ]
})

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}
describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call Validation wit correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = fixtureRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })
  it('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValue(new Error())
    const expectedResponse = await sut.handle(fixtureRequest())
    expect(expectedResponse).toStrictEqual(badRequest(new Error()))
  })
  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const request = fixtureRequest()
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({ ...request, createdAt: new Date() })
  })
  it('Should return 500 if AddSurvey throws exception', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(fixtureRequest())
    expect(httpResponse).toStrictEqual(serverError(new Error()))
  })
  it('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fixtureRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
