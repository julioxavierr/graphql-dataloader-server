// @flow
import DataLoader from 'dataloader';
import { User as UserModel } from '../model';
import ConnectionFromMongoCursor from '../connection/ConnectionFromMongoCursor';

type UserType = {
  id: string,
  _id: string,
  name: string,
  email: string,
  active: boolean,
}

export default class User {
  id: string;
  _id: string;
  name: string;
  email: string;
  active: boolean;

  constructor(data: UserType, viewer) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;

    // you can only see your own email, and your active status
    if (viewer && viewer._id.equals(data._id)) {
      this.email = data.email;
      this.active = data.active;
    }
  }

  static getLoader = () => new DataLoader(
    ids => Promise.all(ids.map(id => UserModel.findOne({ _id: id })))
  );

  static viewerCanSee(viewer, data) {
    // Anyone can se another user
    return true;
  }

  static async load({ user: viewer, dataLoaders }, id) {
    if (!id) return null;

    const data = await dataLoaders.UserLoader.load(id);

    if (!data) return null;

    return User.viewerCanSee(viewer, data) ? new User(data, viewer) : null;
  }

  static clearCache({ dataLoaders }, id) {
    return dataLoaders.UserLoader.clear(id.toString());
  }

  static async loadUsers(ctx, args) {
    const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
    const users = UserModel
      .find(where, { _id: 1 })
      .sort({ createdAt: -1 });

    return ConnectionFromMongoCursor.connectionFromMongoCursor(ctx, users, args, User.load);
  }
}
