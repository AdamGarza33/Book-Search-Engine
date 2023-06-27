const { gql } = require('apollo-server-express');

const typeDefs = gql`
 type Query {
    me: User
 }

 type Mutation {
    login {
        email:
        password:
    } 
 }
type User {
    _id:
    username:
    email:
    bookCount:
    savedBook:
  }

  type Book {
    bookId:
    authors:
    description:
    title:
    image:
    link:
  }

  type Auth {
    token:
    user:
  }
`