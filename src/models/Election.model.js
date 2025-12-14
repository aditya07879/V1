const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    voterKey: {
      type: String,
      required: true,
      unique: true
    },

    isPublished: {
      type: Boolean,
      default: false
    },

    
    resultsPublished: {
      type: Boolean,
      default: false
    },

   
    isActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Election", electionSchema);
