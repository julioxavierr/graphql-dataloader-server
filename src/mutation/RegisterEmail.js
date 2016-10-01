// @flow

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import {
  mutationWithClientMutationId,
} from 'graphql-relay';
import {
  User,
} from '../models';
import { generateToken } from '../auth';

export default mutationWithClientMutationId({
  name: 'RegisterEmail',
  inputFields: {
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    }
  },
  mutateAndGetPayload: async ({ name, email, password }) => {
    if(!name || !email || !password) {
      return {
        token: null,
        error: 'INVALID_EMAIL_PASSWORD',
      }
    }

    let user = await User.findOne({email: email.toLowerCase()});

    if (user) {
      return {
        token: null,
        error: 'EMAIL_ALREADY_IN_USE',
      }
    }

    user = new User({
      name,
      email,
      password: password,
    });
    await user.save();

    return {
      token: generateToken(user),
      error: null,
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({token}) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({error}) => error,
    }
  },
});
