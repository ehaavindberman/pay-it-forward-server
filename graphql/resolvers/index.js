const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const recoResolvers = require('./reco');

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length
  },
  Query: {
    ...postsResolvers.Query,
    ...recoResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...recoResolvers.Mutation
  }
};
