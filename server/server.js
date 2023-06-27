// Import packages
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');

// import user defined files
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

// express server
const app = express();
const PORT = process.env.PORT || 3001;

// new instance of apollo server and pass in schema data/context
const server = newApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

// new instance for apollo server w/ graphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

// Call async function to start server
startApolloServer(typeDefs, resolvers);