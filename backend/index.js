import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mergedResolver from './resolvers/index.js';
import mergedTypeDef from './typeDefs/index.js';
import { connectDB } from './db/connectDB.js';
import ConnectMongoDBSession from 'connect-mongodb-session';
import session from 'express-session';
import passport from 'passport';
import { buildContext } from 'graphql-passport';
import { configurePassport } from './passport/passport.config.js';

dotenv.config();
configurePassport();
const app = express();
const httpServer = http.createServer(app);

const mongoDBStore = ConnectMongoDBSession(session);

const store = new mongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});
store.on('error', (err) => {
  console.log(err);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDef,
  resolvers: mergedResolver,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();
// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/graphql',
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
