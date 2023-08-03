const mongoose = require('mongoose');

const oneDayInSeconds = 86400

const sessionSchema = mongoose.Schema({
  youtubeLink: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    default: 0,
    required: true
  },
  isPlaying: {
    type: Boolean,
    default: false,
    required: true
  }
},
{
    timestamps: true
})

sessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: oneDayInSeconds })

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session }