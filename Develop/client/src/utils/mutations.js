import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($username: String!) {
    loginUser(username: $name) {
      _id
      username
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($userId: ID!) {
    addUser( userId : $userId) {
      _id
      username
      email
      bookCount
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($userId: ID!, $bookId: ID!) {
    saveBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;
;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;
