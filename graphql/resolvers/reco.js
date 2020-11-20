const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateRecoInput } = require('../../util/validators');
const Post = require('../../Models/Post');
const Reco = require('../../Models/Reco');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getRecs() {
      try{
        const recs = await Reco.find().sort({ createdAt: -1 });
        return recs;
      } catch(err) {
        throw new Error(err)
      }
    },
    async getReco(_, { recoId }) {
      try {
        const reco = await Reco.findById(recoId);
        if (reco) {
          return reco;
        } else {
          throw new Error('Reco not found');
        }
      } catch(err) {
        throw new Error('Reco not found'); // tutorial used err here but if post isn't found, I end up in catch
      }
    },
    async getRecsByTag(_, { tag }) {
      try {
        const recs = await Reco.find({tag: tag}).sort({ createdAt: -1 });
        return recs;
      } catch(err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createReco(_,{ text, link, tag }, context) {

      const {errors, valid} = validateRecoInput(text, link, tag);

      if (!valid) {
        throw new UserInputError('Errors', {errors});
      }

      const user = checkAuth(context);

      const newReco = new Reco({
        text,
        link,
        tag,
        createdAt: new Date().toISOString()
      });

      const reco = await newReco.save();

      return reco;
    },

    async addReco(_, { postId, recoId, description }, context) {
      const {username} = checkAuth(context);

      const post = await Post.findById(postId);

      const reco = await Reco.findById(recoId);

      if (!post) {
        throw new UserInputError('Post not found');
      } else if (!reco) {
        throw new UserInputError('Reco not found');
      } else {
        post.recs.push({
          description,
          text: reco.text,
          link: reco.link,
          tag: reco.tag,
          createdAt: new Date().toISOString()
        })

        await post.save();
        return post;
      }
    },
    async deleteReco(_, { postId, recoId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const recoIndex = post.recs.findIndex(r => r.id === recoId);

        if (post.recs[recoIndex].username === username) {
          post.recs.splice(recoIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Authentication not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
}
