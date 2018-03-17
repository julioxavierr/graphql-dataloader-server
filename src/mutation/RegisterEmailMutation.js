// @flow
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { UserLoader } from '../loader';
import { User } from '../model';
import { generateToken } from '../auth';
import pubSub, { EVENTS } from '../pubSub';
import UserType from '../type/UserType';

export default mutationWithClientMutationId({
  name: 'RegisterEmail',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    imageUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ name, email, description, imageUrl, password }) => {
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return {
        token: null,
        error: 'EMAIL_ALREADY_IN_USE',
      };
    }

    user = new User({
      name,
      email,
      description,
      imageUrl,
      password,
    });
    await user.save();

    await pubSub.publish(EVENTS.USER.ADDED, { UserAdded: { user } });

    return {
      user: await user,
      token: generateToken(user),
      error: null,
    };
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: ({ user }) => user,
    },
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
