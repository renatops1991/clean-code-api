export interface Authentication{
  auth (authentication: Authentication.Params): Promise<Authentication.Result>
}

export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }
  export type Result = {
    accessToken: string
    name: string
  }
}
