const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { start } = require('repl');



const app = express();
const PORT = process.env.PORT || 3001;



const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

  // startApolloServer();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // app.get('/api/books/search', async (req, res) => {
  //   try {
  //     const { query } = req.query;
  //     const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  //     const data = await response.json();
  //     res.json(data);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Server error' });
  //   }
  // });

  // app.use('/graphql', expressMiddleware(server, {
  //   context: authMiddleware
  // }));

  // app.use('/graphql', expressMiddleware({ app, path: '/graphql' }));


  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
  }

  // server.authMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();

