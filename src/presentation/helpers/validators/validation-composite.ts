import { Validation } from './validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}
  validate (input: any): Error {
    this.validations.map((error) => {
      const validationError = error.validate(input)
      if (validationError) {
        return validationError
      }
      return null
    })

    return null
  }
}
