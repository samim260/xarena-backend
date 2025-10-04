const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
      }
    ],
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    tag: { type: String, trim: true },
    logo_url: { type: String },
    banner_url: { type: String },
    region: { type: String },
    bio: { type: String }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model("Team", TeamSchema);
