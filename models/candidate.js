const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

//creating a candidateSchema for creating election candidate 
const candidateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  voteCount:{
    type:Number,
    default:0
  },
  votes: [
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true,
        },
        votedAt:{
            type: Date,
            default: Date.now(),
        }
    }
  ],
});

const Candidate = model("Candidate", candidateSchema);
module.exports = Candidate;
