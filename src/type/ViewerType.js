// @flow

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import {
  globalIdField,
  connectionArgs,
  fromGlobalId,
} from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';


import MeType from './MeType';

import UserType from './UserType';
import UserLoader from '../loaders/User';
import UserConnection from '../connection/UserConnection';

export default new GraphQLObjectType({
  name: 'Viewer',
  description: '...',
  fields: () => ({
    id: globalIdField('Viewer'),
    me: {
      type: MeType,
      resolve: (root, args, { user }) => user,
    },
    user: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: (obj, args, {user}) => {
        const { type, id } = fromGlobalId(args.id);
        return UserLoader.load(user, id);
      }
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async ( obj, args, {user} ) => {
        return UserLoader.loadUsers(user, args);
      }
    },
  }),
  interfaces: () => [NodeInterface],
});
