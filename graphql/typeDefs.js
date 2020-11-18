const { gql } = require('apollo-server');

module.exports = gql`
  type Reco {
    id: ID!
    text: String!
    link: String
    tag: String!
    description: String
    createdAt: String!
  }
  type Post {
    id: ID!
    tag: String!
    recs: [Reco]!
    createdAt: String!
    username: String!
    likes: [Like]!
    likeCount: Int!
  }
  type Comment {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getPostsByUser(username: String!): [Post]
    getPostsByTag(tag: String!): [Post]
    getReco(recoId: ID!): Reco
    getRecs: [Reco]
    getRecsByTag(tag: String!): [Reco]
  }
  type Mutation {
    createReco(text: String!, link: String, tag:String!): Reco!
    addReco(recoId: ID!, description: String!, postId: ID!): Post!
    deleteReco(postId: ID!, recoId: ID!): Post!

    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    deleteUser(userId: ID!): String!

    createPost(descriptions: [String!], recoIds: [ID!]): Post!
    deletePost(postId: ID!): String!
    likePost(postId: ID!): Post!
  }
`;
