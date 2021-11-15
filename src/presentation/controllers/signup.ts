export class SignUpController {
  handle (httpRequest: any): any {
    return {
      body: new Error('Missing param: name'),
      statusCode: 400
    }
  }
}
