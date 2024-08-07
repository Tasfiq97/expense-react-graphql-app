import { users } from '../dummyData/data.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const userResolver = {
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log('Error in auth user', error);
        throw new Error(error.message || 'something went wrong');
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findOne(userId);
        return user;
      } catch (error) {
        console.log('Error user query', error);
        throw new Error(error.message || 'something went wrong');
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, password, name, gender } = input;
        if (!username || !password || !name || !gender) {
          throw new Error('All fields are required');
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('User already exist');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const boysProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlsProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new User({
          username,
          name,
          password: hashedPass,
          gender,
          profilePicture: gender === 'male' ? boysProfilePic : girlsProfilePic,
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.log('Error in creating user', error);
        throw new Error(error.message || 'something went wrong');
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        const user = await context.authenticate('graphql-local', { username, password });
        await context.login(user);
        return user;
      } catch (error) {
        console.log('Error in creating user', error);
        throw new Error(error.message || 'something went wrong');
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) throw new Error('something went wrong');
        });
        res.clearCookie('connect.sid');
        return { message: 'logged out successfully' };
      } catch (error) {
        console.log('Error in creating user', error);
        throw new Error(error.message || 'something went wrong');
      }
    },
  },
};

export default userResolver;
