import { gql } from 'apollo-server-express'

export default gql`
    scalar DateTime
    scalar Void

    directive @auth on FIELD_DEFINITION
    
    type Query {
       _: String
    }

    type Mutation {
        _: String
    }
`
