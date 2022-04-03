import {
  HttpRequest,
  Validation,
  AddSurvey,
  AddSurveyModel
} from '../add-survey-controller-protocols'
import { AddSurveyController } from '../add-survey-controller'
import { badRequest, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeRequest = (): HttpRequest => ({
  body: {
    question: 'foo?',
    answers: [{
      answer: 'bar',
      image: 'images/foo.png'
    }],
    createdAt: new Date()
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeSurvey()
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
    const httpRequest = makeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValue(new Error())
    const expectedResponse = await sut.handle(makeRequest())
    expect(expectedResponse).toEqual(badRequest(new Error()))
  })
  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('Should return 500 if AddSurvey throws exception', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
