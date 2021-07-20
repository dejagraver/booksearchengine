
const {User} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, args, context) => {
            if(context.user){
                const user = await User.findOne({_id: context.user._id}).populate('savedBooks');
                return user;
            }

            throw new AuthenticationError('Not logged into account')
        }
    },
    Mutation: {
        login: async (_, args) => {
            const user = await User.findOne({email: args.email});
            if(!user) throw new AuthenticationError('Incorrect credentials.');
            
            const verified = await user.isCorrectPassword(args.password);
            if(!verified) throw new AuthenticationError('Incorrect credentials.');

            const token = signToken(user);
            return {token, user};

        },
        addUser: async (_, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },
        saveBook: async (_, args, context) => {
            const { title, authors, description, bookId, image, link } = args;
            if(context.user){
                const user = await User.findByIdAndUpdate(
                    context.user._id, 
                    { $addToSet: { savedBooks: { title, authors, description, bookId, image, link } } },
                    {new: true, runValidators: true}
                );
                return user;
            }

            throw new AuthenticationError('Not logged into account')
        },
        removeBook: async (_, {bookId}, context) => {
            if(context.user){
                const user = await User.findByIdAndUpdate(
                    context.user._id,
                    {$pull: {savedBooks: {bookId}}},
                    {new: true}
                );
                return user;
            }

            throw new AuthenticationError('Not logged into account')
        }
    }
};

module.exports = resolvers;