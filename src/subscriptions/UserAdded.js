// external imports
import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';
// local imports
import UserType from '../type/UserType';
import pubSub from '../pubSub';

const UserAddedPayloadType = new GraphQLObjectType({
  name: 'UserAddedPayload',
  fields: () => ({
    user: {
      type: UserType,
      resolve: ({ user }) => {
        return {
          cursor: offsetToCursor(user.id),
          node: user,
        };
      },
    },
  }),
});

const userAdded = {
  type: UserAddedPayloadType,
  subscribe: () => pubSub.asyncIterator('userAdded'),
};

export default userAdded;
