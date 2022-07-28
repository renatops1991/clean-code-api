import { EmailValidator } from '@/validation/protocols/email-validator'

export const mockEmailValidators = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
