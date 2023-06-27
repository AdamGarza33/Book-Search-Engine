const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolver = {
    Query: {
        // get the logged in user from context and find user details in the db
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id: context.user._id});
            }
            throw new AuthenticationError('Log in required');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            // Find the user with the given email
            const user = await User.findOne({ email });
            
            // If no user is found, throw an AuthenticationError
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
              }

              // Checks if provided password is correct
              const correctPw = await user.isCorrectPassword(password);
        
              // If the password is incorrect, throw an AuthenticationError
              if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
              }
        
               // Generate a token for the authenticated user
              const token = signToken(user);
              
              // return token and user object
              return { token, user };
    },

    // get the logged in user from context and add a book to users savedBooks array
    saveBook: async (parent, book, context) => {
        if (context.user) {
            return User.findOneAndUpdate(
              { _id: context.user._id},
              {
                $addToSet: { savedBooks: book},
              },
              {
                new: true,
                runValidators: true 
              }
            );
          }
          // If a user attempts to execute this mutation and is not logged in, throw an error
          throw new AuthenticationError('You need to be logged in!');
        },
        
        // retrieve the logged in user from the context and remove the book from the user's savedBooks array
        removeBook: async (parent, { bookId }, context) => {
          if (context.user) {
            return User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId: bookId } } },
              { new: true }
            );
          }
          throw new AuthenticationError('You need to be logged in!');
    }
}};