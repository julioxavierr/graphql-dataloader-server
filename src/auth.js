// @flow

import jwt from 'jsonwebtoken';
import { User } from './models';
import { jwtSecret } from './config';

export async function getUser(token: string) {
  console.log('token: ', token);

  if (!token) return { user: null };

  try {
    const decodedToken = jwt.verify(token.substring(4), jwtSecret);

    console.log('decoed: ', decodedToken);

    const user = await User.findOne({ _id: decodedToken.id });

    return {
      user,
    };
  } catch (err) {
    return { user: null };
  }
}

type UserType = {
  _id: string,
}

export function generateToken(user: UserType) {
  return `JWT ${jwt.sign({ id: user._id }, jwtSecret)}`;
}
