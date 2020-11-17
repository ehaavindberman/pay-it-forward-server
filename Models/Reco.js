const { model, Schema } = require('mongoose');

const recoSchema = new Schema({
  // handling required fields in GraphQL layer, not here
  text: String,
  link: String,
  tag: String,
  createdAt: String,
  description: String
});

module.exports = model('Reco', recoSchema);
