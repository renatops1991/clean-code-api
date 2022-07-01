import {
  loginPath,
  surveyPath,
  surveysPath,
  signupPath,
  surveyResultPath
} from './paths/'

export default {
  '/login': loginPath,
  '/signup': signupPath,
  '/survey': surveyPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
