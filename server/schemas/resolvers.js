const { User , Book } = require('../models');
const { signToken , AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // geting all users
    // users: async () => {
    //   return User.find().populate('savedBooks');
    // },

    // // geting a single user by id
    // user: async (parent, { userId }) => {
    //   return User.findOne({ _id: userId }).populate('savedBooks');
    // },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
        .select("-__v -password")

        return userData;
      }
      throw AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      console.log("add user");
      const user = await User.create(args);
      const token = signToken(user);
      

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    // Add a third argument to the resolver to access data in our `context`
    saveBook: async (parent, { bookToSave }, context) => {
      // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            // saving to the savedBooks array
            $addToSet: { savedBooks: bookToSave },
          },
          {
            new: true,
          });
        
        return updatedUser;
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError;
    },
    // Make it so a logged in user can only remove a skill from their own profile
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError;
    },
  },
};

module.exports = resolvers;