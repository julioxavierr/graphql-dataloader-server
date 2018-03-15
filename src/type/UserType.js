// @flow

import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';

export default new GraphQLObjectType({
  name: 'User',
  description: 'User data',
  fields: () => ({
    id: globalIdField('User'),
    _id: {
      type: GraphQLString,
      resolve: user => user._id,
    },
    name: {
      type: GraphQLString,
      resolve: user => user.name,
    },
    email: {
      type: GraphQLString,
      resolve: user => user.email,
    },
    description: {
      type: GraphQLString,
      resolve: user => user.description,
    },
    imageUrl: {
      type: GraphQLString,
      resolve: user => user.imageUrl,
    },
    active: {
      type: GraphQLBoolean,
      resolve: user => user.active,
    },
  }),
  interfaces: () => [NodeInterface],
});
