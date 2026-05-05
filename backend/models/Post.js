const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    body:     { type: String, required: true },
    userId:   { type: Number, default: 1 },
    category: {
      type: String,
      enum: ['sports', 'politics', 'entertainment'],
      default: 'sports',
      required: true,
    },    comments: [
      {
        name: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
