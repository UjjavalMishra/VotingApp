const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// creatign uesrSchema for user data 
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  adderess: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
  },
  email: {
    type: String,
  },
  adharNo: {
    type: Number,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted : {
  type: Boolean,
  default : false,
  }
});

// hashing the users password storing it into db
userSchema.pre('save', async function(next){
  const user = this; 
  if(!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
})

// creating a comparePassword method for password confirmation
userSchema.methods.comparePassword = async function(candidatePassword){
  try {
    const isMatched = await bcrypt.compare(candidatePassword.toString(), this.password);
    return isMatched;
  } catch (error) {
    throw error;
  }
}

const User = model("User", userSchema);
module.exports = User;
