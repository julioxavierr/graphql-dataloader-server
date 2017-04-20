// @flow

import 'isomorphic-fetch';

import Koa from 'koa';
import cors from 'koa-cors';
import graphqlHttp from 'koa-graphql';
import convert from 'koa-convert';
import logger from 'koa-logger';

import { schema } from './schema';
import { jwtSecret } from './config';
import { getUser } from './auth';
import * as loaders from './loader';

const app = new Koa();

app.keys = jwtSecret;

const graphqlSettingsPerReq = async (req) => {

  const { user } = await getUser(req.header.authorization);

  const dataloaders = Object.keys(loaders).reduce((dataloaders, loaderKey) => ({
    ...dataloaders,
    [loaderKey]: loaders[loaderKey].getLoader(),
  }), {});

  return {
    graphiql: process.env.NODE_ENV !== 'production',
    schema,
    context: {
      user,
      req,
      dataloaders,
    },
    formatError: (error) => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  };
};

const graphqlServer = convert(graphqlHttp(graphqlSettingsPerReq));

app.use(logger());
app.use(convert(cors()));
app.use(graphqlServer);

export default app;
