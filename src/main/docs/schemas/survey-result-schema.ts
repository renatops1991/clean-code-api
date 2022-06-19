export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswerResult'
      }
    },
    createdAt: {
      type: 'string'
    }
  },
  required: ['surveyId', 'question', 'answers', 'createdAt']
}
