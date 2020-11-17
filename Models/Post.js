const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  // handling required fields in GraphQL layer, not here
  username: String,
  createdAt: String,
  recs: [
    {
      recoId: String,
      text: String,
      link: String,
      tag: String,
      description: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = model('Post', postSchema);
