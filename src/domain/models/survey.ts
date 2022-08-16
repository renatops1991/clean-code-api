export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  createdAt: Date
  didAnswer?: boolean
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}
