export type SurveyModel ={
  id: string
  question: string
  answers: SurveyAnswerModel[]
  createdAt: Date
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}
