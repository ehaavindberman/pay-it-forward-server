const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  // handling required fields in GraphQL layer, not here
  username: String,
  password: String,
  email: String,
  createdAt: String
});

module.exports = model('User', userSchema);
