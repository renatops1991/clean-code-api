import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

const makeRequest = (): HttpRequest => ({
  body: {
    question: 'foo?',
    aswers: [{
      answer: 'bar',
      image: 'images/foo.png'
    }]
  }
})
describe('AddSurvey Controller', () => {
  it('Should call Validation wit correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const sut = new AddSurveyController(validationStub)
    const httpRequest = makeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
