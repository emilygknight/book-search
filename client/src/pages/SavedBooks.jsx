import React from 'react';
import {Container,Card,Button,Row,Col} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';
import { getSavedBookIds ,removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  let userData = data?.me || {};
  console.log(userData);

  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [removeBookMutation] = useMutation(REMOVE_BOOK);


  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Use the removeBookMutation to execute the REMOVE_BOOK mutation
      const { data } = await removeBookMutation({
        variables: { 
          bookId: bookId,
        },
      });

      // Check the mutation response and update the state accordingly
      const removedBookId = data.removeBook.savedBooks[0].bookId;

      setSavedBookIds(savedBookIds.filter((id) => id !== removedBookId));

      removeBookId(removeBookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => (
   
              <Col key={book.bookId} md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          )};
          
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
