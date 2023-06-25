import express from 'express';
import userRoutes from './user';
import passport from 'passport';
import session from 'express-session';

const app = express();

app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

app.use('/user', userRoutes);  

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
