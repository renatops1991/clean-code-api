export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  createdAt: Date
}

type SurveyResultAnswerModel = {
  image?: string
  answer: string
  count: number
  percent: number
}
