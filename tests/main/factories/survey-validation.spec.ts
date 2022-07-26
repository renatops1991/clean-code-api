import { makeAddSurveyValidation } from '@/main/factories/controllers/survey-validation'
import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation } from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')
describe('AddSurveyValidationFactory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
  })
})
