// TODO: make recs likable instead of posts
const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../Models/Post');
const Reco = require('../../Models/Reco');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts(){
      try{
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch(err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }){
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch(err) {
        throw new Error('Post not found'); // tutorial used err here but if post isn't found, I end up in catch
      }
    },
    async getPostsByUser(_, { username }) {
      try {
        const posts = await Post.find({ username: username }).sort({ createdAt: -1 });
        return posts;
      } catch(err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { }, context) {
      const user = checkAuth(context);

      const newPost = new Post({
        userId: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if(user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch(err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)){
          // post already liked, so unlike it
          post.likes = post.likes.filter(like => like.username != username);
        } else {
          // not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
}
