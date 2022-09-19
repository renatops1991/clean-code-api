import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        surveys: [Survey!]!
    }

    type Survey {
        id: ID
        question: String!
        answers: [SurveyAnswer!]!
        createdAt: DateTime!
        didAnswer: Boolean
    }

    type SurveyAnswer {
        image: String
        answer: String!
    }
`
