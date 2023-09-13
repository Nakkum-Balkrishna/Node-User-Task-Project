const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be greater than 0");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: [6, "Must be at least 6, got {VALUE}"],
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("cannot set password as password");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    type: Buffer
  }
},{
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

//filtering
userSchema.methods.toJSON = function (){
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

//this is called as instance methods
userSchema.methods.generateAuthToken = async function () {
  const user = this; // this we are accessing the instance
  const token = await jwt.sign(
    { _id: user._id.toString() },
    "thisismynewcourse"
  );

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

//this is a model method
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to find a user with this email");
  }

  // match password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to find a user with this email");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  // console.log("Just before saving...!");

  // mongoose check if password has been modified
  /**
   * well be uisng isModified which accepts property name as the param to check
   */
  if (user.isModified("password")) {
    // hsh the passwor
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});


userSchema.pre('deleteOne', { document: true }, async function(next){
  const user = this
  await Task.deleteMany({owner: user._id})
  next()
})

const User = mongoose.model("User", userSchema);

module.exports = User;
