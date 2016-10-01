// @flow

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

import Viewer from '../loaders/Viewer';
import ViewerType from '../type/ViewerType';

import User from '../loaders/User';
import UserType from '../type/UserType';

const {
  nodeField,
  nodeInterface,
} = nodeDefinitions(
  // A method that maps from a global id to an object
  async (globalId, {user}) => {
    const {id, type} = fromGlobalId(globalId);

    // console.log('id, type: ', type, id, globalId);
    if (type === 'User') {
      return await User.load(user, id);
    }
    if (type === 'Viewer') {
      return await Viewer.load(id);
    }
  },
  // A method that maps from an object to a type
  (obj) => {
    // console.log('obj: ', typeof obj, obj.constructor);
    if (obj instanceof User) {
      return UserType;
    }
    if (obj instanceof Viewer) {
      return ViewerType;
    }
  }
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;
