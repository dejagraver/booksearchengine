const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    input BookContent {
        bookId: String
        title: String
        authors: [String]
        description: String
        image: String
        link: String
    }
    type Book {
        bookId: String
        title: String
        authors: [String]
        description: String
        image: String
        link: String
    }
    type Auth {
        token: ID!
        user: User
    }
    type Query{
        me: User
    }
    type Mutation{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(content: BookContent!): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;