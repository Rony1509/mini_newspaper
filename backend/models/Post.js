const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body:  { type: String, required: true },
    userId:{ type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
