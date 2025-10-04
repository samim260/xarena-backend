const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "team",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled", "expired"],
    default: "pending"
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
  }
}, { timestamps: true, versionKey: false });

const invite = mongoose.model("invite", Schema);

module.exports = invite