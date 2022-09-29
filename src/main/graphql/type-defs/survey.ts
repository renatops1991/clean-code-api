import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        surveys: [Survey!]! @auth
    }

    extend type Mutation {
        survey (question: String!, answers: [AnswerInput]!): Void @auth
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

    input AnswerInput {
        image: String
        answer: String!  
    }
`
