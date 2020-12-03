const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
//const { SECRET_KEY } = require('../../config.js');
const User = require('../../Models/User');

function generateToken(user){
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  },
  process.env.SECRET_KEY,
  { expiresIn: '1h'});
}

module.exports = {
  Query: {
    async getUsers() {
      try{
        const users = await User.find();
        return users;
      } catch(err) {
        throw new Error(err);
      }
    },
    async getUserByUsername(_, { username }){
      try {
        const user = await User.findOne({username:username});
        if (user) {
          return user;
        } else {
          throw new Error('User not found');
        }
      } catch(err) {
        throw new Error('User not found'); // tutorial used err here but if post isn't found, I end up in catch
      }
    }
  },
  Mutation: {
    async login(_, {username, password}){
      const {errors, valid} = validateLoginInput(username, password);

      if(!valid) {
        throw new UserInputError('Errors', {errors});
      }

      let user = await User.findOne({username});

      if(!user){
        const emailLogin = await User.findOne({email: username});
        if(!emailLogin) {
          errors.general = 'User not found';
          throw new UserInputError('User not found', { errors });
        } else {
          user = emailLogin;
        }
      }

      const match = await bcrypt.compare(password, user.password);
      if(!match){
        errors.general = 'Incorrect password';
        throw new UserInputError('Incorrect password', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword}
      },
    ) {
      // validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if(!valid) {
        throw new UserInputError('Errors', {errors});
      }
      // Make sure user doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // Make sure email doesn't already exist
      const user2 = await User.findOne({ email });
      if (user2) {
        throw new UserInputError('This email is already in use', {
          errors: {
            username: 'This email is already in use'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const images = ['ade.jpg','chris.jpg','jenny.jpg','justen.jpg','joe.jpg',
                      'nan.jpg','stevie.jpg','veronika.jpg','matthew.png','zoe.jpg',
                      'elliot.jpg','steve.jpg','molly.png','daniel.jpg'];
      var image = images[Math.floor(Math.random() * images.length)];
      const newUser = new User({
        email,
        username,
        password,
        image,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save(); // save user to db

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      }
    },
    async deleteUser(_, { userId }) {

      try {
        const user = await User.findById({userId});
        await user.delete();
        return 'User deleted successfully';
      } catch(err) {
        throw new Error(err);
      }
    }
  }
}
